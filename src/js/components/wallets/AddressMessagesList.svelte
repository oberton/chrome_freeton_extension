<div>
  <div class='main-scrollable' use:scrollable on:bottom={loadMore} style={"max-height:" + (hasAlert ? 287 : 374) + "px"}>
    {#each messages as message (message.id)}
      <div class='gtr-b-xxs gtr-hor-sm'>
        <div class='tbl fixed hover-parent gtr-hor-sm'>
          <div class='tbl-cell'>
            <div>
              <div class='smile alg-m'>
                <AddressEllipsis label={t('labels.message.id')} take={5} address={message.id}></AddressEllipsis>
              </div>
              <div class='smile alg-m hover-parent-show'>
                <CopyTextBtn
                  label={t('actions.message.copy_id')}
                  value={message.id}>
                </CopyTextBtn>
              </div>
            </div>
            <div class='color-light text-xs'>
              {message.createdAt.toLocaleTimeString()} - {message.createdAt.toLocaleDateString()}
            </div>
          </div>
          <div class='tbl-cell text-right alg-m'>
            <div>
              <div class='text-md' style='height: 39px; line-height: 39px;'>
                <TonAmount gemPos='right' value={message.value}></TonAmount>
              </div>
              <div class='color-light text-xs'>
                {#if message.dst === address}
                  <span class='icon-arrow-left color-green'></span>
                  {#if message.src}
                    {message.src.substring(0, 5)}
                  {:else}
                    {message.msgType.substring(0, 3)}
                  {/if}
                {:else}
                  <span class='icon-arrow-right color-red'></span>
                  {#if message.dst}
                    {message.dst.substring(0, 5)}
                  {:else}
                    {message.msgType.substring(0, 3)}
                  {/if}
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}

    {#if loading}
      <ListLoader times={10}>
        <div>
          <div style="height: 23px;width: 39%;background: white;margin-left: 38%;"></div>
          <div style="height: 12px;width: 100%; background: white;"></div>
          <div style="height: 11px;width: 30%; background: white; margin-left: 52%;"></div>
        </div>
      </ListLoader>
    {/if}

  </div>
</div>

<script>
  export let address;
  export let hasAlert;

  const msgTypes = {
    0: 'internal',
    1: 'extIn',
    2: 'extOut',
  };

  let messages = [];
  let messagesCount;
  let loading = false;

  let subscribeHandleIn;
  let subscribeHandleOut;

  function decorateMessage(message) {
    message.createdAt = new Date(+`${message.created_at}000`);
    message.msgType = msgTypes[message.msg_type];
    return message;
  }

  const filterOut = {
    src: {
      eq: address,
    },
  };

  const filterIn = {
    dst: {
      eq: address,
    },
  };

  async function loadMore() {
    if (messages.length >= messagesCount || loading) {
      return;
    }

    const params = {};

    loading = true;

    const [errOut, responseOut ] = await to(tonMethods.getMessagesList(address, 15, filterOut));

    if (errOut) {
      utils.exception(errOut);
      return;
    }

    const [errIn, responseIn ] = await to(tonMethods.getMessagesList(address, 15, filterIn));

    if (errIn) {
      utils.exception(errIn);
      return;
    }

    const outLastTime = _.get(_.last(responseOut).created_at);

    if (outLastTime) {
      _.assign(filterOut, {
        created_at: {
          le: outLastTime,
        },
      });
    }

    const inLastTime = _.get(_.last(responseIn).created_at);

    if (inLastTime) {
      _.assign(filterIn, {
        created_at: {
          le: inLastTime,
        },
      });
    }

    const result = _([...responseIn, ...responseOut])
      .map(decorateMessage)
      .sortBy('createdAt')
      .reverse()
      .value();

    loading = false;

    messages = [...messages, ...result];
  }

  function onNewMessage(data) {
    messages = [decorateMessage(data.result), ...messages];
    messagesCount += 1;
  }

  svelte.onMount(async () => {
    const [err, response] = await to(tonMethods.getMessagesCount(address));
    if (err) {
      utils.exception(err);
      return;
    }
    messagesCount = response;
    loadMore();

    subscribeHandleIn = await tonMethods.subscribeForMessages(filterIn, onNewMessage);
    subscribeHandleOut = await tonMethods.subscribeForMessages(filterOut, onNewMessage);
  });

  svelte.onDestroy(async () => {
    if (subscribeHandleIn) {
      await tonMethods.unsubscribe(subscribeHandleIn);
    }
    if (subscribeHandleOut) {
      await tonMethods.unsubscribe(subscribeHandleOut);
    }
  });
</script>

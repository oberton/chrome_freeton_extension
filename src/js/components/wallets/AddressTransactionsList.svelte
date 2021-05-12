<div class='main-scrollable' use:scrollable on:bottom={loadMore} style='height: 100%; max-height: unset;'>
  {#each transactions as transaction (transaction.id)}
    <div class='gtr-b-xxs fadeIn gtr-hor-sm'>
      <div class='gtr-hor-sm'>
        <div class='tbl fixed hover-parent'>
          <div class='tbl-cell'>
            <div>
              <div class='smile alg-m'>
                <AddressEllipsis label={t('labels.transaction.id')} take={4} address={transaction.id}></AddressEllipsis>
              </div>
              <div class='smile alg-m hover-parent-show'>
                <CopyTextBtn
                  label={t('actions.transaction.copy_id')}
                  value={transaction.id}>
                </CopyTextBtn>
              </div>
            </div>
            <div class='color-light text-xs'>
              {formatTime(transaction.createdAt)} - {formatDate(transaction.createdAt)}
            </div>
          </div>
          <div class='tbl-cell text-right alg-m'>
            <div>
              <div class='text-md' style='height: 39px; line-height: 39px;'>
                <TonAmount gemPos='right' value={transaction.value}></TonAmount>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/each}

  {#if loading}
    <div class='gtr-hor'>
      <ListLoader times={10}>
        <div>
          <div style="height: 23px;width: 39%;background: white;margin-left: 38%;"></div>
          <div style="height: 12px;width: 100%; background: white;"></div>
          <div style="height: 11px;width: 48%; background: white; margin-left: 52%;"></div>
        </div>
      </ListLoader>
    </div>
  {/if}
</div>


<script>
  export let address;

  let transactions = [];
  let transactionsCount;
  let loading = false;
  let subscribeHandle;

  const formatTime = utils.formatTime;
  const formatDate = utils.formatDate;

  function decorateTransaction(transaction) {

    _.assign(transaction, {
      value: parseInt(transaction.balance_delta, 10) - parseInt(transaction.total_fees, 10),
      createdAt: new Date(+`${transaction.now}000`),
    });

    return transaction;
  }

  function onNewTransaction(data) {
    transactions = [decorateTransaction(data.result), ...transactions];
    transactionsCount += 1;
  }

  async function loadMore() {
    if (transactions.length >= transactionsCount || loading) {
      return;
    }
    const params = {};
    if (transactions.length) {
      const le = _.get(_.last(transactions), 'now');
      if (le) {
        params.now = {le};
      }
    }

    loading = true;
    const [err, response ] = await to(tonMethods.getTransactionsList(address, 30, params));

    loading = false;

    if (err) {
      utils.exception(err);
      return;
    }
    transactions = [...transactions, ..._.map(response, decorateTransaction)];
  }

  svelte.onMount(async () => {
    const [err, response] = await to(tonMethods.getTransactionsCount(address));
    if (err) {
      utils.exception(err);
      return;
    }
    transactionsCount = response;
    loadMore();
    subscribeHandle = await tonMethods.subscribeForTransactions([address], onNewTransaction);
  });

  svelte.onDestroy(async () => {
    if (subscribeHandle) {
      await tonMethods.unsubscribe(subscribeHandle);
    }
  });
</script>

<div>
  <form on:submit|preventDefault={sendTokens}>

    <div class='text-row'>

      <FormControl
        required={true}
        bind:value={formData.from}
        label={t('labels.from')} />

      <FormControl
        required={true}
        bind:value={formData.to}
        label={t('labels.to')} />

      <FormControl
        type='number'
        required={true}
        bind:value={formData.amount}
        min={0.001}
        max={$$props.balance}
        step={0.001}
        label={t('labels.amount')} />

      <div class='text-sm gtr-t row-b color-label'>
        <div class='smile pointer pos-rel' style='z-index: 1' use:tooltipMenu use:tooltip data-tooltip='Transaction Payload'>
          {t('send_tokens.payload.' + payloadType)}
          <span class='icon-angle-down'></span>
        </div>
        <div class='tooltip-menu'>
          {#each payloadTypes as type}
            {#if type !== payloadType}
              <div class='tooltip-menu-item' close-tooltip on:click={() => setPayloadType(type)}>
                {t('send_tokens.payload.' + type)}
              </div>
            {/if}
          {/each}
        </div>
      </div>

      {#if payloadType === 'comment'}
        <FormControl
          type='text'
          bind:value={formData.comment}
          label={t('labels.optional')} />
      {:else if payloadType === 'function'}

        <FormTextArea
          type='text'
          bind:value={formData.abiJSON}
          label='ABI JSON' />

        <FormTextArea
          type='text'
          bind:value={formData.functionParams}
          label='Function Params (JSON)' />

      {:else if payloadType === 'payload'}
        <FormControl
          type='text'
          bind:value={formData.payload}
          label='Payload' />
      {/if}

    </div>

    <button type='submit' class='btn-blue font-bold full-width'>
      {t('actions.tokens.confirm_send')}
    </button>

  </form>
</div>

<script>
  const dispatch = svelte.createEventDispatcher();

  let payloadType = 'comment';

  const payloadTypes = [
    'comment',
    'function',
    'payload',
  ];

  const formData = {
    from: $$props.wallet.address,
    to: '',
    amount: '',
    comment: '',
    paramsJSON: '',
    functionParams: '',
    payload: '',
  };

  function setPayloadType(type) {
    payloadType = type;
  }

  async function sendTokens() {
    utils.page.showLoader();

    let err, result;

    const { from, amount } = formData;
    const sendTo = formData.to;
    const { keys, contract } = $$props;

    if (payloadType === 'function') {

      if (_.isEmpty(utils.safeJSONParse(formData.abiJSON))) {
        utils.toast.error("Invalid ABI JSON");
        utils.page.hideLoader();
        return;
      }

      if (_.isEmpty(utils.safeJSONParse(formData.functionParams))) {
        utils.toast.error("Invalid ABI PARAMS");
        utils.page.hideLoader();
        return;
      }

      [err, result] = await to(tonMethods.sendTokensWithPayload(from, sendTo, amount, keys, true, contract, formData.paramsJSON, formData.functionParams));

    } else if (payloadType === 'payload') {
      if (_.isEmpty(formData.payload)) {
        utils.toast.error(t('error.send_tokens.invalid_base64'));
        utils.page.hideLoader();
        return;
      }

      [err, result] = await to(tonMethods.sendTokensWithBase64Payload(from, sendTo, amount, keys, true, contract, formData.payload));

    } else {
      [err, result] = await to(tonMethods.sendTokens(from, sendTo, amount, keys, formData.comment || null, true, contract));
    }

    utils.page.hideLoader();

    if (err) {
      utils.exception(err);
      return;
    }

    dispatch('transactionSent', result);

  }

</script>

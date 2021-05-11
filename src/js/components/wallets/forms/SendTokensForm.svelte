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
        <div
          class='smile pointer pos-rel'
          style='z-index: 1'
          use:tooltipMenu
          use:tooltip
          data-tooltip={t('send_tokens.send_options.title')}>

          {t('send_tokens.send_options.' + payloadType)}
          <span class='icon-angle-down'></span>
        </div>
        <div class='tooltip-menu'>
          {#each payloadTypes as type}
            {#if type !== payloadType}
              <div class='tooltip-menu-item' close-tooltip on:click={() => setPayloadType(type)}>
                {t('send_tokens.send_options.' + type)}
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
        <FormControl
          required={true}
          bind:value={formData.functionName}
          label={t('send_tokens.function_name')} />

        <FormTextArea
          type='text'
          required={true}
          bind:value={formData.abiJSON}
          label={t('send_tokens.abi_json')} />

        <FormTextArea
          type='text'
          required={true}
          bind:value={formData.functionParams}
          label={t('send_tokens.function_params')} />

      {:else if payloadType === 'payload'}
        <FormControl
          type='text'
          required={true}
          bind:value={formData.payload}
          label={t('send_tokens.payload')} />
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
    abiJSON: '',
    functionParams: '',
    functionName: '',
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

    const exit = (key) => {
      utils.toast.error(t(`error.send_tokens.${key}`));
      utils.page.hideLoader();
      return;
    };

    if (payloadType === 'function') {
      if (!formData.functionName) {
        exit('invalid_function_name');
        return;
      }

      if (_.isEmpty(utils.safeJSONParse(formData.abiJSON))) {
        exit('invalid_abi_json');
        return;
      }

      if (_.isEmpty(utils.safeJSONParse(formData.functionParams))) {
        exit('invalid_function_params');
        return;
      }

      [err, result] = await to(tonMethods.sendTokensWithPayload(from, sendTo, amount, keys, true, contract, JSON.parse(formData.abiJSON), formData.functionName, JSON.parse(formData.functionParams)));

    } else if (payloadType === 'payload') {

      if (_.isEmpty(formData.payload)) {
        exit('invalid_payload');
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

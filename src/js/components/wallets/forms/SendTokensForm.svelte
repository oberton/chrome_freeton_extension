<div>
  {#if formData.payloadType}
    <form on:submit|preventDefault={sendTokens}>

      <div class='text-row'>

        {#if allWallets}
          <WalletPicker
            label={t('labels.from')}
            wallets={allWallets}
            bind:value={formData.from}>
          </WalletPicker>
        {/if}

        <FormControl
          required={true}
          bind:value={formData.to}
          label={t('labels.to')} />

        <FormControl
          type='number'
          required={true}
          bind:value={formData.amount}
          min={0.001}
          max={balance}
          step={0.001}
          label={t('labels.amount')} />

        <div class='text-sm gtr-t row-b color-label'>
          <div
            class='smile pointer pos-rel'
            style='z-index: 1'
            use:tooltipMenu
            use:tooltip
            data-tooltip={t('send_tokens.send_options.title')}>

            {t('send_tokens.send_options.' + formData.payloadType)}
            <span class='icon-angle-down'></span>
          </div>
          <div class='tooltip-menu'>
            {#each payloadTypes as type}
              {#if type !== formData.payloadType}
                <div class='tooltip-menu-item' close-tooltip on:click={() => setPayloadType(type)}>
                  {t('send_tokens.send_options.' + type)}
                </div>
              {/if}
            {/each}
          </div>
        </div>

        {#if formData.payloadType === 'comment'}
          <FormControl
            type='text'
            bind:value={formData.comment}
            label={t('labels.optional')} />

        {:else if formData.payloadType === 'function'}
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

        {:else if formData.payloadType === 'payload'}
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
      <!--
      <button type='button' class='btn-blue' on:click={testSdk}>
        Test SDK
      </button>
      -->

    </form>
  {/if}
</div>

<script>
  function testSdk() {
    if (conf.apiId) {
      utils.eventBus.trigger('oberton-extension-response', {
        apiId: conf.apiId,
        tabId: conf.apiTabId,
        subject: 'someSubject',
        value: true,
      });
    }
  }

  const dispatch = svelte.createEventDispatcher();

  let balance;

  const payloadTypes = [
    'comment',
    'function',
    'payload',
  ];

  let formData = {};

  function setPayloadType(type) {
    formData.payloadType = type;
  }

  async function sendTokens() {
    utils.page.showLoader();

    let err, result;

    const from = formData.from;
    const amount = +formData.amount;

    const sendTo = formData.to;

    const { keys, contract } = _.find(allWallets, w => w.address === formData.from) || {};

    const exit = (key) => {
      utils.toast.error(t(`error.send_tokens.${key}`));
      utils.page.hideLoader();
      if (conf.apiId) {
        utils.eventBus.trigger('oberton-extension-response', {
          apiId: conf.apiId,
          tabId: conf.apiTabId,
          subject: 'transactionFailed',
          value: { error: key, info: t(`error.send_tokens.${key}`)},
        });
      }
      return;
    };

    if (formData.payloadType === 'function') {
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

    } else if (formData.payloadType === 'payload') {

      if (_.isEmpty(formData.payload)) {
        exit('invalid_payload');
        return;
      }

      [err, result] = await to(tonMethods.sendTokensWithBase64Payload(from, sendTo, amount, keys, true, contract, formData.payload));

    } else {
      debugger
      [err, result] = await to(tonMethods.sendTokens(from, sendTo, amount, keys, formData.comment || null, true, contract));
    }

    utils.page.hideLoader();

    if (err) {
      if (conf.apiId) {
        utils.eventBus.trigger('oberton-extension-response', {
          apiId: conf.apiId,
          tabId: conf.apiTabId,
          subject: 'transactionFailed',
          value: { error: err },
        });
      }
      return;
    }

    dispatch('transactionSent', result);

    if (conf.apiId) {
      utils.eventBus.trigger('oberton-extension-response', {
        apiId: conf.apiId,
        tabId: conf.apiTabId,
        subject: 'transactionSent',
        value: result,
      });
    }

  }

  let allWallets;

  svelte.onMount(async () => {
    allWallets = await tonMethods.getAllWallets();

    const emptyFormData = {
      from: '',
      to: '',
      amount: '',
      comment: '',
      abiJSON: '',
      functionParams: '',
      functionName: '',
      payload: '',
      payloadType: 'comment',
    };

    console.log({$$props});
    formData = _.assign(emptyFormData, $$props);

    if (!_.includes(payloadTypes, formData.payloadType)) {
      formData.payloadType = payloadTypes[0];
    }

    const walletFrom = _.find(allWallets, w => w.address === formData.from);

    if (!walletFrom) {
      formData.from = allWallets[0].address;
    }

  });

</script>

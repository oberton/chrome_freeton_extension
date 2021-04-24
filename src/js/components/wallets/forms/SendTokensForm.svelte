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

      <FormControl
        type='text'
        bind:value={formData.comment}
        label={t('labels.comment')} />

    </div>

    <button type='submit' class='btn-blue font-bold full-width'>
      {t('actions.tokens.confirm_send')}
    </button>

  </form>
</div>

<script>
  const dispatch = svelte.createEventDispatcher();

  const formData = {
    from: $$props.wallet.address,
    to: '',
    amount: '',
    comment: '',
  };

  async function sendTokens() {
    utils.page.showLoader();
    const [err, result] = await to(tonMethods.sendTokens(formData.from, formData.to, formData.amount, $$props.keys, formData.comment, false, $$props.contract));
    utils.page.hideLoader();

    if (err) {
      utils.exception(err);
      return;
    }

    dispatch('transactionSent', result);

  }

</script>

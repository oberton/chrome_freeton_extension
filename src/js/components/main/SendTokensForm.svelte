<div>
  <form>

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
        label={t('labels.amount')} />

      <FormControl
        type='number'
        required={true}
        bind:value={formData.comment}
        label={t('labels.comment')} />

    </div>

    <button type='submit' class='btn-blue font-bold full-width'>
      {t('actions.tokens.confirm_send')}
    </button>

  </form>
</div>

<script>
  const formData = {
    from: $$props.wallet.address,
    to: '',
    amount: '',
    comment: '',
  };

</script>

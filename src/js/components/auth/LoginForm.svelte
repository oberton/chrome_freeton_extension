<div class='gtr-t-xs gtr-hor-sm'>
  <div id='phrase-form'>
    <div class='phrase-form-container'>
      <div class='text-md text-row'>
        {t('actions.wallet.restore')}
      </div>
      <div class='gtr-ver font-bold row-l-sm gtr-r-xs'>
        <NetworkSwitcher />
      </div>
      <RestoreWalletForm
        phrasePlaceholder={t('actions.sign_in.with_phrase')}
        submitLabel={t('actions.sign_in.title')} on:restore={restoreWallet}></RestoreWalletForm>
    </div>
    <div class='text-center gtr-b-xs gtr-t-sm text-sm color-light'>
      {t('common.or')}
    </div>
    <button on:click={() => toggleFlag.createWalletDialog(true)} class='btn-blue-light font-bold full-width' type='button'>
      {t('actions.wallet.create')}
    </button>
  </div>

  {#if $flag.createWalletDialog }
    <ModalDialog on:close={() => toggleFlag.createWalletDialog(false)} headline={t('actions.wallet.create')}>
      <CreateWalletForm on:walletAdded={onWalletAdded}></CreateWalletForm>
    </ModalDialog>
  {/if}
</div>

<script>

  function restoreWallet(e) {
    dispatch('submit', e.detail);
  }

  const dispatch = svelte.createEventDispatcher();

  const { flag, toggleFlag } = utils.initFlags([
    'createWalletDialog',
  ]);

  let phrase = '';

  function onWalletAdded(e) {
    toggleFlag.createWalletDialog(false);
    dispatch('submit', e.detail);
  }
</script>

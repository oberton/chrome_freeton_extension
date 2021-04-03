<div class='gtr-t gtr-hor-sm'>
  <form id='phrase-form' class='fadeIn' on:submit={signIn}>
    <div class='phrase-form-container'>
      <div class='text-md text-row'>
        {t('actions.wallet.restore')}
      </div>
      <div class='gtr-ver row-hor-sm font-bold'>
        <NetworkSwitcher />
      </div>
      <div class='gtr-t color-dim row-b-xs'>
        {t('actions.sign_in.with_phrase')}
      </div>
      <PhraseArea bind:phrase={phrase} />
    </div>
    <button class='btn-blue font-bold full-width text-md' type='submit'>
      {t('actions.sign_in.title')}
    </button>
    <div class='text-center gtr-b-xs gtr-t-sm text-sm color-light'>
      {t('common.or')}
    </div>
    <button on:click={toggleFlag.createWalletDialog} class='btn-blue-light font-bold full-width' type='button'>
      {t('actions.wallet.create')}
    </button>
  </form>

  {#if $flag.createWalletDialog }
    <ModalDialog on:close={toggleFlag.createWalletDialog} headline={t('actions.wallet.create')}>
      <CreateWalletForm on:walletAdded={onWalletAdded}/>
    </ModalDialog>
  {/if}
</div>

<script>

  const dispatch = svelte.createEventDispatcher();
  const { flag, toggleFlag } = utils.initFlags([
    'createWalletDialog',
  ]);

  let phrase = '';

  function signIn() {
    dispatch('submit', phrase.trim());
  }

  function onWalletAdded(e) {
    toggleFlag.createWalletDialog(false);
    phrase = e.detail;
    signIn();
  }
</script>

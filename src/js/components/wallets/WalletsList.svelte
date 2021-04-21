<div class='row-l-xs'>
  {#if wallets.length }
    <div style='max-height: 350px; overflow: auto;' class='row gtr-hor gtr-ver-sm'>
      {#each wallets as wallet (wallet.phrase)}
        <WalletItem wallet={wallet} on:removeWallet={() => removeWallet(wallet)}/>
      {/each}
    </div>
  {:else}
    <div class='text-center pos-rel' style='height: 350px'>
      <div class='tbl'>
        <div class='tbl-cell text-center alg-m'>
          <div class='text-md'>
            {t('info.no_data')}
          </div>
          <div class='gtr-t text-sm gtr-hor'>
            {t('info.wallet.create_first')}
          </div>
        </div>
      </div>
    </div>
  {/if}

  <div class='text-center gtr-ver bg-white row-r-xs' style='position: absolute; bottom: 0; left: 0; right: 0;'>
    <div class='smile'>
      <button
        use:tooltipMenu
        placement='top'
        class='btn-blue btn-round smile'>
        <span class='icon-add text-lg'></span>
      </button>
      <div class='tooltip-menu'>
        <div class='tooltip-menu-item' close-tooltip on:click={toggleFlag.createWalletDialog}>
          {t('actions.wallet.create')}
        </div>
        <div class='tooltip-menu-item' close-tooltip on:click={toggleFlag.restoreWalletDialog}>
          {t('actions.wallet.restore')}
        </div>
        <div class='tooltip-menu-item' close-tooltip on:click={toggleFlag.importKeysDialog}>
          {t('actions.wallet.import_keys')}
        </div>
      </div>
    </div>
  </div>

  {#if $flag.restoreWalletDialog }
    <ModalDialog on:open={setEmptyPhrase} on:close={toggleFlag.restoreWalletDialog} headline={t('actions.wallet.restore')}>
      <div>
        <div class='text-row'>
          <PhraseArea bind:phrase={phrase} />
        </div>
        <button class="btn-blue font-bold full-width text-md" on:click={restoreWallet}>
          {t('actions.wallet.restore')}
        </button>
      </div>
    </ModalDialog>
  {/if}

  {#if $flag.createWalletDialog }
    <ModalDialog on:close={toggleFlag.createWalletDialog} headline={t('actions.wallet.create')}>
      <CreateWalletForm on:walletAdded={onWalletAdded}/>
    </ModalDialog>
  {/if}

  <ImportKeysDialog
    on:close={toggleFlag.importKeysDialog}
    on:add-keys={importKeys}
    shown={$flag.importKeysDialog}>
  </ImportKeysDialog>
</div>

<script>

  export let currentNetwork;

  const { flag, toggleFlag } = utils.initFlags([
    'createWalletDialog',
    'restoreWalletDialog',
    'importKeysDialog',
  ]);

  let wallets = [];
  let phrase = '';
  let allWallets;

  function setEmptyPhrase() {
    phrase = '';
  }

  async function importKeys(e) {
    const keys = e.detail;
    toggleFlag.importKeysDialog(false);

    await utils.storage.push('myPhrases', {
      ...keys,
      network: currentNetwork,
    });

    utils.toast.info(t('info.wallet.created'));
  }

  async function refreshWallets() {
    allWallets = await utils.storage.getArrayValue('myPhrases', conf.myPin);
    wallets = allWallets.filter(w => w.network === currentNetwork);
  }

  function onWalletAdded() {
    toggleFlag.createWalletDialog(false);
    refreshWallets();
    utils.toast.info(t('info.wallet.created'));
    refreshWallets();
  }

  async function removeWallet(wallet) {
    const indexToRemove = _.findIndex(allWallets, w => {
      const phraseMatch = wallet.phrase && wallet.phrase === w.phrase;
      if (phraseMatch) {
        return true;
      }
      const keysMatch = wallet.public && wallet.secret && wallet.public === w.public && wallet.secret === w.secret;
      if (keysMatch) {
        return true;
      }
      return false;
    });

    await utils.storage.splice('myPhrases', indexToRemove, 1, conf.myPin);
    utils.toast.info(t('info.wallet.removed'));
    setTimeout(refreshWallets);
  }

  async function restoreWallet() {
    if (_.find(wallets, w => w.phrase === phrase)) {
      utils.toast.error(t('info.wallet.exists'));
      return;
    }

    const [err, result] = await to(tonMethods.getWalletData(phrase));

    if (err) {
      utils.exception(err);
      return;
    }

    const network = conf.currentTonServer || conf.tonServers[0];
    const phrases = await utils.storage.push('myPhrases', {phrase: result.phrase, network});

    refreshWallets();
    toggleFlag.restoreWallet(false);
    utils.toast.info('info.wallet.restored');
  }

	svelte.onMount(async () => {
    refreshWallets();
	});
</script>

<div class='row-l-xs'>
  {#if wallets.length }
    <div style='max-height: 350px; overflow: auto;' class='row gtr-hor gtr-ver-sm'>
      {#each wallets as wallet (wallet.tmpId)}
        <div class='hoverable gtr-hor-sm gtr-ver-sm row-hor-sm row-ver-sm'>
          <WalletItem wallet={wallet} on:removeWallet={() => removeWallet(wallet)}/>
        </div>
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
    <ModalDialog on:close={toggleFlag.restoreWalletDialog} headline={t('actions.wallet.restore')}>
      <RestoreWalletForm on:restore={restoreWallet}></RestoreWalletForm>
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
  let allWallets;

  const contracts = conf.contracts;

  async function refreshWallets() {
    allWallets = await utils.storage.getArrayValue('myPhrases', conf.myPin);
    wallets = allWallets.filter(w => w.network === currentNetwork);
  }

  async function importKeys(e) {
    const detail = e.detail;
    const { keys } = detail;

    toggleFlag.importKeysDialog(false);

    const payload = {
      ...keys,
      network: currentNetwork,
    };

    if (detail.contract && detail.contract !== conf.contracts[0].file) {
      payload.contract = detail.contract;
    }

    await utils.storage.push('myPhrases', payload);

    utils.toast.info(t('info.wallet.created'));
    await refreshWallets();
  }

  function onWalletAdded() {
    toggleFlag.createWalletDialog(false);
    refreshWallets();
    utils.toast.info(t('info.wallet.created'));
    refreshWallets();
  }

  async function removeWallet(wallet) {
    const indexToRemove = _.findIndex(allWallets, w => w.tmpId === wallet.tmpId);
    await utils.storage.splice('myPhrases', indexToRemove, 1, conf.myPin);
    utils.toast.info(t('info.wallet.removed'));
    refreshWallets();
  }

  async function restoreWallet(e) {
    const payload = e.detail;
    const phrases = await utils.storage.push('myPhrases', payload);
    setTimeout(refreshWallets);
    toggleFlag.restoreWalletDialog(false);
    utils.toast.info('info.wallet.restored');
  }

	svelte.onMount(async () => {
    refreshWallets();
	});
</script>

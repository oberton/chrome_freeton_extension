<div class='row-l-xs'>
  {#if wallets.length }
    <div class='main-scrollable'>
      {#each wallets as wallet (wallet.tmpId)}
        <div class='hoverable gtr-hor-sm gtr-t-xxs gtr-b-xs row-hor-sm row-ver-sm'>
          <WalletItem
            wallet={wallet}
            on:open={() => showWallet(wallet)}
            on:removeWallet={() => removeWallet(wallet)}>
          </WalletItem>
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

  <div class='text-center gtr-ver gtr-r bg-white row-r-xs' style='position: absolute; bottom: 0; left: 0; right: 0;'>
    <div class='tbl fixed'>
      <div class='tbl-cell alg-m cell-4'>
        <button
          use:tooltip
          on:click={() => refreshWallets(true)}
          data-tooltip={t('actions.wallet.refresh')}
          class='btn-blue-light btn-round smile'>
          <span class='icon-loop' style='font-size: 1.5em'></span>
        </button>

      </div>
      <div class='tbl-cell cell-4 alg-m'>
        <div class='smile'>
          <button
            use:tooltipMenu
            use:tooltip
            data-tooltip={t('actions.wallet.add')}
            placement='top'
            class='btn-blue btn-round smile'>
            <span class='icon-add' style='font-size: 1.8em; line-height: 1.75em'></span>
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

      <div class='tbl-cell cell-4 alg-m'>
        <a
          href={telegramLink}
          target='_blank'
          use:tooltip
          class='btn-blue-light btn-round smile'>
          <span class='icon-telegram' use:tooltip data-tooltip={t('info.telegram_chat_link')} style='font-size: 1.8em'></span>
        </a>
      </div>
    </div>
  </div>

  {#if $flag.restoreWalletDialog }
    <ModalDialog on:close={() => toggleFlag.restoreWalletDialog(false)} headline={t('actions.wallet.restore')}>
      <RestoreWalletForm on:restore={restoreWallet}></RestoreWalletForm>
    </ModalDialog>
  {/if}

  {#if $flag.createWalletDialog }
    <ModalDialog on:close={() => toggleFlag.createWalletDialog(false)} headline={t('actions.wallet.create')}>
      <CreateWalletForm on:walletAdded={onWalletAdded}/>
    </ModalDialog>
  {/if}

  <ImportKeysDialog
    on:close={() => toggleFlag.importKeysDialog(false)}
    on:add-keys={importKeys}
    shown={$flag.importKeysDialog}>
  </ImportKeysDialog>
</div>

<script>

  export let currentNetwork;

  const dispatch = svelte.createEventDispatcher();

  const telegramLink = conf.telegramLink;

  const { flag, toggleFlag } = utils.initFlags([
    'createWalletDialog',
    'restoreWalletDialog',
    'importKeysDialog',
  ]);

  let wallets = [];
  let allWallets;

  const contracts = conf.contracts;

  function showWallet(wallet) {
    dispatch('open-wallet-details', wallet); 
  }

  async function refreshWallets(force = false) {
    if (force) {
      wallets = [];
    }
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

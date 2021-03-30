<div>
  <div class='text-line gtr-r-3x'>
    <div class='gtr-r-sm'>
      <NetworkSwitcher on:change={refreshWallets} />
    </div>
  </div>

  <!--<div class='text-line text-sm'>
    <Tabs bind:tab={activeTab} tabs={tabs} />
  </div>-->


  {#if activeTab === t('main.tabs.wallets') }
    <div class='row-l-xs'>

      {#if wallets.length }
        <div style='max-height: 350px; overflow: auto;' class='row gtr-hor'>
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
            <div class='tooltip-menu-item' close-tooltip on:click={createWallet}>
              {t('actions.wallet.create')}
            </div>
            <div class='tooltip-menu-item' close-tooltip on:click={displayRestoreDialog}>
              {t('actions.wallet.restore')}
            </div>
          </div>
        </div>
      </div>
      {#if showRestoreDialog }
        <ModalDialog on:close={() => showRestoreDialog = false} headline={t('actions.wallet.restore')}>
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
      {#if showCreateWalletDialog}
        <ModalDialog on:close={() => showCreateWalletDialog = false} headline={t('actions.wallet.create')}>
          <CreateWalletForm on:walletAdded={onWalletAdded}/>
        </ModalDialog>
      {/if}
    </div>

  {:else if activeTab === t('main.tabs.depools') }
    <DePools />
  {/if}

</div>

<script>
  let showRestoreDialog = false;

  let wallets = [];
  let phrase = '';
  let allWallets;

  let showAdvanced = false;

  function toggleAdvanced() {
    showAdvanced = !showAdvanced;
  }

  const tabs = [
    t('main.tabs.wallets'),
    t('main.tabs.stakes'),
    t('main.tabs.depools'),
  ];

  let activeTab = tabs[0];

  async function refreshWallets() {
    const currentNetwork =  conf.currentTonServer || conf.tonServers[0];
    allWallets = await utils.storage.getArrayValue('myPhrases', conf.myPin);
    wallets = allWallets.filter(w => w.network === currentNetwork);
    console.log(wallets);
  }

  let showCreateWalletDialog = false;

  function createWallet() {
    showCreateWalletDialog = true;
  }

  function onWalletAdded() {
    showCreateWalletDialog = false;
    refreshWallets();
    utils.toast.info(t('info.wallet.created'));
  }

  async function removeWallet(wallet) {
    const indexToRemove = _.findIndex(allWallets, w => {
      return w.phrase === wallet.phrase && w.network === wallet.network;
    });
    await utils.storage.splice('myPhrases', indexToRemove, 1, conf.myPin);
    utils.toast.info(t('info.wallet.removed'));
    setTimeout(refreshWallets);
  }

  function displayRestoreDialog() {
    phrase = '';
    showRestoreDialog = true;
  }

  async function restoreWallet() {
    if (_.find(wallets, w => w.phrase === phrase)) {
      utils.toast.error(t('info.wallet.exists'));
      return;
    }

    try {
      const result = await tonMethods.getWalletData(phrase);

      const network = conf.currentTonServer || conf.tonServers[0];
      const phrases = await utils.storage.push('myPhrases', {phrase: result.phrase, network}, conf.myPin);

      refreshWallets();

      showRestoreDialog = false;

      utils.toast.info('info.wallet.restored');

    } catch(e) {
      utils.toast.error('info.phrase.invalid');
    }
  }

	svelte.onMount(async () => {
    refreshWallets();
	});
</script>

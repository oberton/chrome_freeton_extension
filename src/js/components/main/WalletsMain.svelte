<div>
  <div class='text-line row-t-2x gtr-r-2x'>
    <div class='gtr-r-sm'>
      <NetworkSwitcher on:change={refreshWallets} />
    </div>
  </div>

  <div class='text-line text-sm'>
    <Tabs bind:tab={activeTab} tabs={tabs} />
  </div>


  {#if activeTab === t('main.tabs.wallets') }
    <div>
      {#each wallets as wallet, index}
        <WalletItem wallet={wallet} on:removeWallet={() => removeWallet(index)}/>
      {/each}

      <div class='text-center gtr-t row-r-xs'>
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
    </div>

  {:else if activeTab === t('main.tabs.depools') }
    <DePools />
  {/if}

</div>

<script>
  let showRestoreDialog = false;

  let wallets = [];
  let phrase = '';

  const tabs = [
    t('main.tabs.wallets'),
    t('main.tabs.stakes'),
    t('main.tabs.depools'),
  ];

  let activeTab = tabs[0];

  async function refreshWallets() {
    const currentNetwork =  conf.currentTonServer || conf.tonServers[0];
    const allWallets = await utils.storage.getArrayValue('myPhrases', conf.myPin);
    wallets = allWallets.filter(w => w.network === currentNetwork);
  }

  async function createWallet() {
    const { phrase } = await tonMethods.getWalletData(null, true);
    refreshWallets();
  }

  async function removeWallet(index) {
    await utils.storage.splice('myPhrases', index, 1, conf.myPin);
    utils.toast.info(t('info.wallet.removed'));
    refreshWallets();
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

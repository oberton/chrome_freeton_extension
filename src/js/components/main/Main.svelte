<div>

  {#if activeTab !== 'walletDetails' }
    <div class='gtr-b-sm gtr-r-3x gtr-l-sm'>
      <div class='gtr-r-sm'>
        <NetworkSwitcher on:change={updateNetwork} />
      </div>
    </div>
  {/if}

  {#key currentNetwork}
    {#if activeTab === t('main.tabs.wallets') }
      <WalletsList
        on:open-wallet-details={openWalletDetails}
        on:sendCrystals={onSendCrystals}
        currentNetwork={currentNetwork}>
      </WalletsList>
    {:else if activeTab === 'walletDetails'}
      <WalletItemMain
        on:close={() => activeTab = t('main.tabs.wallets')}
        wallet={activeWallet}>
      </WalletItemMain>
    {:else if activeTab === t('main.tabs.depools') }
      <DePools />
    {/if}
  {/key}

  {#if $flag.sendCrystalFormDialog }
    <ModalDialog on:close={() => toggleFlag.sendCrystalFormDialog(false)} headline={t('actions.tokens.send')}>
      <SendTokensForm
        {...sendTokens}
        on:transactionSent={onTransactionSent} />
    </ModalDialog>
  {/if}

</div>

<script>
  export let apiParams;

  const { flag, toggleFlag } = utils.initFlags([
    'sendCrystalFormDialog',
  ]);

  const tabs = [
    t('main.tabs.wallets'),
    t('main.tabs.stakes'),
    t('main.tabs.depools'),
  ];

  let activeTab = tabs[0];
  let activeWallet;

  let currentNetwork = conf.currentTonServer || conf.tonServerKeys[0];

  let sendTokens = {};

  function onSendCrystals(e) {
    sendTokens = { from: e.detail };
    toggleFlag.sendCrystalFormDialog(true);
  }

  function openWalletDetails(e) {
    activeWallet = e.detail;
    activeTab = 'walletDetails';
  }

  function onTransactionSent() {
    toggleFlag.sendCrystalFormDialog(false);
    utils.toast.info(t('info.transaction.sent'));
  }

  function updateNetwork() {
    currentNetwork = conf.currentTonServer || conf.tonServerKeys[0];
  }

  svelte.onMount(() => {
    if (apiParams && apiParams.fn) {
      if (apiParams.fn === 'sendTokens') {
        sendTokens = apiParams.params;
        toggleFlag.sendCrystalFormDialog(true);
      }
    }
  });

</script>

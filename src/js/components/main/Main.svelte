<div>

  {#if activeTab !== 'walletDetails' }
    <div class='text-line gtr-r-3x'>
      <div class='gtr-r-sm'>
        <NetworkSwitcher on:change={updateNetwork} />
      </div>
    </div>
  {/if}

  {#key currentNetwork}
    {#if activeTab === t('main.tabs.wallets') }
      <WalletsList
        on:open-wallet-details={openWalletDetails}
        currentNetwork={currentNetwork}>
      </WalletsList>
    {:else if activeTab === 'walletDetails'}
      <WalletItemMain
        wallet={activeWallet}>
      </WalletItemMain>
    {:else if activeTab === t('main.tabs.depools') }
      <DePools />
    {/if}
  {/key}

</div>

<script>
  const tabs = [
    t('main.tabs.wallets'),
    t('main.tabs.stakes'),
    t('main.tabs.depools'),
  ];

  let activeTab = tabs[0];
  let activeWallet;

  let currentNetwork = conf.currentTonServer || conf.tonServers[0];

  function openWalletDetails(e) {
    activeWallet = e.detail;
    activeTab = 'walletDetails';
  }

  function updateNetwork() {
    currentNetwork = conf.currentTonServer || conf.tonServers[0];
  }

</script>

<div>
  <div class='text-line gtr-r-3x'>
    <div class='gtr-r-sm'>
      <NetworkSwitcher on:change={updateNetwork} />
    </div>
  </div>

  <!--<div class='text-line text-sm'>
    <Tabs bind:tab={activeTab} tabs={tabs} />
  </div>-->

  {#key currentNetwork}
    {#if activeTab === t('main.tabs.wallets') }
      <WalletsList currentNetwork={currentNetwork} />
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

  let currentNetwork = conf.currentTonServer || conf.tonServers[0];

  function updateNetwork() {
    currentNetwork = conf.currentTonServer || conf.tonServers[0];
  }

</script>

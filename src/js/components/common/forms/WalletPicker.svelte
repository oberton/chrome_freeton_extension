<div class='wallets-picker'>
  <div class='form-group' use:tooltipMenu>
    <div class='form-control wallets-picker-control'>
      <div class='tbl'>
        <div class='tbl-cell alg-m text-xs'>
          {#key currentWallet}
            {#if currentWallet}
              <WalletListItem wallet={currentWallet} mode="sm"></WalletListItem>
            {/if}
          {/key}
        </div>
        <div class='gtr-t alg-m tbl-cell cell-gtr alg-m text-xs text-right'>
          <span class='icon-angle-down'></span>
        </div>
      </div>
    </div>
    <label class="form-label">{label}</label>
  </div>

  <div class='tooltip-menu wallets-picker-menu'>
    {#each wallets as wallet}
      {#if wallet.address !== value}
        <div class='tooltip-menu-item text-sm' close-tooltip on:click={() => pickWallet(wallet)}>
          <WalletListItem wallet={wallet} mode="sm"></WalletListItem>
        </div>
      {/if}
    {/each}
  </div>
</div>

<script>
  export let value;
  export let wallets;
  export let label;

  let currentWallet;

  let balance;

  function pickWallet(wallet) {
    value = wallet.address;
    currentWallet = wallet;
  }


  svelte.onMount(async () => {
    currentWallet = _.find(wallets, w => w.address === value);
    console.log({currentWallet, wallets});
  });
</script>

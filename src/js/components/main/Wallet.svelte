<div>
  Hello from my wallet
  <div class='text-line'>
    <NetworkSwitcher on:change={refreshWallets} />
  </div>
  {#each wallets as wallet, index}
    <WalletItem wallet={wallet} on:removeWallet={() => removeWallet(index)}/>
  {/each}

 <button on:click={createWallet} class='btn-blue-light font-bold full-width' type='button'>Create Wallet</button>
</div>

<script>
  import NetworkSwitcher from '../common/NetworkSwitcher.svelte';
  import WalletItem from './WalletItem.svelte';
  import { onMount } from 'svelte';

  let wallets = [];


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
    refreshWallets();
  }

	onMount(async () => {
    refreshWallets();
	});
</script>

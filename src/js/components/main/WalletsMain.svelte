<div>
  <div class='text-line row-t-2x gtr-r-2x'>
    <div class='gtr-r-sm'>
      <NetworkSwitcher on:change={refreshWallets} />
    </div>
  </div>

  <div class='text-line'>
    <Tabs bind:tab={activeTab} tabs={tabs} />
  </div>


  {#if activeTab === "Wallets"}
    <div>
      {#each wallets as wallet, index}
        <WalletItem wallet={wallet} on:removeWallet={() => removeWallet(index)}/>
      {/each}

      <div class='text-right gtr-t row-r'>
        <div class='smile'>
          <button
            use:tooltipMenu
            placement='top-end'
            class='btn-blue btn-round smile'>
            <span class='icon-add text-lg'></span>
          </button>
          <div class='tooltip-menu'>
            <div class='tooltip-menu-item' close-tooltip on:click={createWallet}>
              Create Wallet
            </div>
            <div class='tooltip-menu-item' close-tooltip on:click={displayRestoreDialog}>
              Restore Wallet
            </div>
          </div>
        </div>
      </div>
      {#if showRestoreDialog }
        <ModalDialog on:close={() => showRestoreDialog = false} headline='Restore Wallet'>
          <div>
            <div class='text-row'>
              <PhraseArea bind:phrase={phrase} />
            </div>
            <button class="btn-blue font-bold full-width text-md" on:click={restoreWallet}>
              Restore
            </button>
          </div>
        </ModalDialog>
      {/if}
    </div>

  {:else if activeTab === "DePools"}
    <DePools />
  {/if}

</div>

<script>
  import { tooltipMenu } from 'js/directives/tooltipMenu.dir';
  import NetworkSwitcher from '../common/NetworkSwitcher.svelte';
  import ModalDialog from '../common/ModalDialog.svelte';
  import WalletItem from './WalletItem.svelte';
  import PhraseArea from 'js/components/common/PhraseArea.svelte';
  import Tabs from 'js/components/common/Tabs.svelte';
  import DePools from './DePools.svelte';

  let showRestoreDialog = false;

  let wallets = [];
  let phrase = '';

  const tabs = ["Wallets", "DePools", "My Stakes"];
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
    utils.toast.info('Wallet Removed');
    refreshWallets();
  }

  function displayRestoreDialog() {
    phrase = '';
    showRestoreDialog = true;
  }

  async function restoreWallet() {
    if (_.find(wallets, w => w.phrase === phrase)) {
      utils.toast.error('Wallet is already added.');
      return;
    }

    try {
      const result = await tonMethods.getWalletData(phrase);

      const network = conf.currentTonServer || conf.tonServers[0];
      const phrases = await utils.storage.push('myPhrases', {phrase: result.phrase, network}, conf.myPin);

      refreshWallets();

      showRestoreDialog = false;

      utils.toast.info('Wallet Restored');

    } catch(e) {
      utils.toast.error('Invalid Phrase');
    }
  }

	onMount(async () => {
    refreshWallets();
	});
</script>

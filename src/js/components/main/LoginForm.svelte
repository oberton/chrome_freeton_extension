<script>
  import NetworkSwitcher from 'js/components/common/NetworkSwitcher.svelte';
  import PhraseArea from 'js/components/common/PhraseArea.svelte';

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let phrase = '';

  function signIn() {
    dispatch('submit', phrase.trim());
  }

  async function createWallet() {
    const { phrase } = await tonMethods.getWalletData(null, true);
    dispatch('submit', phrase);
  }

</script>

<div>
  <form id='phrase-form' class='fadeIn' on:submit={signIn}>
    <div class='phrase-form-container'>
      <div class='text-md gtr-b-2x'>Restore Surf</div>
      <div class='text-row font-bold'>
        <NetworkSwitcher />
      </div>
      <div class='color-dim gtr-b'>Sign In with password backup.</div>
      <PhraseArea bind:phrase={phrase} />
    </div>
    <button class='btn-blue font-bold full-width text-md' type='submit'>Sign In</button>
    <div class='text-center gtr-b-xs gtr-t-sm text-sm color-light'>or</div>
    <button on:click={createWallet} class='btn-blue-light font-bold full-width' type='button'>Create Wallet</button>
  </form>
</div>

<script>
  import { onMount } from 'svelte';
  import storage from 'js/utils/utils/storage';

  import PinForm from './PinForm.svelte';

	let name = 'world';
  let wallets = null;
  let step = null;

	onMount(async () => {
    const result = await storage.get(['myPhrases']);
    name = result;

    if (result && result.myPhrases) {
      step = 'pin';
    } else {
      step = 'login';
    }
	});
</script>


<div>
  {#if step === 'pin'}
    <PinForm />
  {/if}

  {#if step === 'login'}
    <div>login step</div>
  {/if}
</div>

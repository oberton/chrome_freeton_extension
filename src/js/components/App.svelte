<script>
  import { onMount } from 'svelte';

  import storage from 'js/utils/utils/storage';

  import PinForm from './PinForm.svelte';

	let name = 'world';
  let wallets = null;
  let step = null;
  let pinError = false;


  function showPinError() {
    pinError = true;
    setTimeout(() => {
      pinError = false;
    }, 150);
  }

  async function checkPin(e) {
    const pin = e.detail;
    try {
      const phrases = await storage.getArrayValue('myPhrases', pin);

      if (!phrases) {
        showPinError();
        return;
      }

      conf.myPin = pin;
      step = 'wallet';
    } catch (e) {
      showPinError();
    }
  }

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
    <PinForm title={'Enter Pin'} pinError={pinError} on:submit={checkPin} />

  {/if}

  {#if step === 'login'}
    <div>login step</div>
  {/if}

  {#if step === 'wallet'}
    <div>hello wallet</div>
  {/if}
</div>

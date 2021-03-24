<div class='gtr-t'>
  {#if loggedIn }

    <div
      id="logout-button"
      class="color-blue font-bold text-sm"
      on:click={logout}
      style="position: absolute; cursor: pointer; top: 25px; right: 0px;">
      <button
        type="button"
        class="btn-blue-light btn-round"
        title={t('actions.logout')}>
          <span class="icon-logout text-lg"></span>
      </button>
    </div>
  {/if}

  {#if step === 'pin'}
    <PinForm title={t('actions.pin.enter')} pinError={pinError} on:submit={checkPin} />
  {/if}

  {#if step === 'createPin'}
    <PinForm
      title={t('actions.pin.create')}
      placeholder={t('info.pin.device_info')}
      on:submit={createPin} />
  {/if}

  {#if step === 'confirmPin'}
    <PinForm
      title={t('actions.pin.confirm')}
      placeholder={t('info.pin.confirm_info')}
      canGoBack={true}
      pinError={pinError}
      on:back={() => step = 'createPin'}
      on:submit={confirmPin} />
  {/if}

  {#if step === 'login'}
    <LoginForm on:submit={signIn} />
  {/if}

  {#if step === 'wallet'}
    <WalletsMain />
  {/if}
</div>

<script>

	let name = '';
  let wallets = null;
  let step = null;
  let pinError = false;
  let loggedIn = false;

  let phrase;
  let newPin;


  function showPinError() {
    pinError = true;
    setTimeout(() => {
      pinError = false;
    }, 150);
  }

  async function checkPin(e) {
    const pin = e.detail;

    try {
      const phrases = await utils.storage.getArrayValue('myPhrases', pin);

      if (!phrases) {
        showPinError();
        return;
      }

      conf.myPin = pin;
      step = 'wallet';
      loggedIn = true;
    } catch (e) {
      showPinError();
    }
  }

  function createPin(e) {
    newPin = e.detail;
    step = 'confirmPin';
  }

  function confirmPin(e) {
    setTimeout(async () => {
      const pin = e.detail;
      if (pin !== newPin) {
        showPinError();
        return;
      }

      conf.myPin = pin;

      const result = await tonMethods.getWalletData(phrase);

      const network = conf.currentTonServer || conf.tonServers[0];
      const phrases = await utils.storage.push('myPhrases', {phrase: result.phrase, network}, pin);

      conf.myPin = pin;
      step = 'wallet';
    });
  }

  function signIn(e) {
    phrase = e.detail;
    step = 'createPin';
  }

  async function logout() {
    await utils.storage.remove('myPhrases');
    loggedIn = false;
    step = 'login';
  }

	svelte.onMount(async () => {
    const result = await utils.storage.get(['myPhrases']);
    name = result;

    if (result && result.myPhrases) {
      step = 'pin';
      loggedIn = true;
    } else {
      step = 'login';
    }

    conf.myPin = '222222';
    step = 'wallet';
	});
</script>

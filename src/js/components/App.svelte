<div>
  {#key currentLocale}
    <div
      id="logout-button"
      class="text-right cell-12 gtr-t-sm"
      style='height: 45px; margin-bottom: -45px; display: block;'>
      <button
        type="button"
        class="btn-dim-light btn-round"
        use:tooltipMenu
        title={t('actions.logout')}>
          <span class="icon-cog text-lg"></span>
      </button>
      <div class='tooltip-menu'>
        <div class='tooltip-menu-item' close-tooltip on:click={toggleFlag.languageDialog}>
          {t('actions.change_language')}
        </div>
        {#if loggedIn }
          <div class='tooltip-menu-item' close-tooltip on:click={logout}>
            {t('actions.logout')}
          </div>
        {/if}
      </div>
    </div>

    {#if step === 'pin'}
      <PinForm
        title={t('actions.pin.enter')}
        pinError={pinError}
        on:submit={checkPin} />
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

    {#if step === 'main'}
      <Main />
    {/if}

    {#if $flag.languageDialog}
      <ModalDialog on:close={() => toggleFlag.languageDialog(false)} headline={t('actions.change_language')}>
        <div>
          {#each supportedLocales as locale }
            <div class='tooltip-menu-item' on:click={() => setLocale(locale[0])}>{locale[1]}</div>
          {/each}
        </div>
      </ModalDialog>
    {/if}
  {/key}
</div>

<script>

  const { flag, toggleFlag } = utils.initFlags([
    'languageDialog',
  ]);

  const supportedLocales = _.toPairs(conf.supportedLocales);
  let currentLocale = conf.currentLocale;

  async function setLocale(locale) {
    toggleFlag.languageDialog();
    await utils.changeLocale(locale);
    currentLocale = locale;
  }

	let name = '';
  let wallets = null;
  let step = null;
  let pinError = false;
  let loggedIn = false;

  let newWallet;
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
      step = 'main';
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

      const result = await tonMethods.getWalletData(newWallet.phrase);

      const network = newWallet.network || conf.currentTonServer || conf.tonServers[0];
      const phrases = await utils.storage.push('myPhrases', {...newWallet, phrase: result.phrase, network}, pin);

      conf.myPin = pin;
      step = 'main';
      loggedIn = true;
    });
  }

  function signIn(e) {
    newWallet = e.detail;
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

    if (NODE_ENV !== 'production' && conf.devAutopin) {
      const phrasesEncrypted = await utils.storage.get('myPhrases');
      if (phrasesEncrypted.myPhrases) {
        conf.myPin = conf.devAutopin;
        step = 'main';
      }
    }
  });
</script>

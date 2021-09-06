<div class='gtr-ver-sm'>
  {#key initTime}
    <div>
      {#key currentLocale}
        <div
          id="logout-button"
          class="text-right cell-12"
          style='height: 45px; margin-bottom: -45px; display: block; position: relative; z-index: 2; width: 30px; float: right;'>
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
            {#if !loggedIn || step === 'main' }
              <div class='tooltip-menu-item' close-tooltip on:click={toggleFlag.showImportWalletsDialog}>
                {t('actions.import_wallet.wallets')}
              </div>
            {/if}
            {#if loggedIn }
              {#if step === 'main'}
                <div class='tooltip-menu-item' close-tooltip on:click={backupWallets}>
                  {t('actions.backup_wallets')}
                </div>
              {/if}
              <div class='tooltip-menu-item' close-tooltip on:click={toggleFlag.showLogoutDialog}>
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
          {#key apiParams}
            <Main apiParams={apiParams} />
          {/key}
        {/if}

        {#if $flag.showImportWalletsDialog}
          <ImportBackupForm on:restored={onBackupRestored} loggedIn={loggedIn}></ImportBackupForm>
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
        {#if $flag.showLogoutDialog}
          <ModalDialog on:close={() => toggleFlag.showLogoutDialog(false)} headline={t('logout.title')}>
            <div class='text-line color-red text-sm'>
              {t('logout.info')}
            </div>
            {#if step === 'main'}
              <div class='text-line color-label'>
                {t('logout.backup_info')}
              </div>
              <div class='text-line'>
                <button class='btn-blue-light cell-12' on:click={backupWallets}>{t('logout.backup_create')}</button>
              </div>
            {/if}
            <div class='text-line'>
              <button on:click={logout} class='btn-red cell-12 font-semi'>{t('actions.logout')}</button>
            </div>
          </ModalDialog>
        {/if}
      {/key}
    </div>
  {/key}
</div>

<script>

  let initTime;

  const { flag, toggleFlag } = utils.initFlags([
    'languageDialog',
    'showImportWalletsDialog',
    'showLogoutDialog',
  ]);

  const supportedLocales = _.toPairs(conf.supportedLocales);
  let currentLocale = conf.currentLocale;

  async function setLocale(locale) {
    toggleFlag.languageDialog();
    await utils.changeLocale(locale, true);
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

  function onBackupRestored() {
    initTime = +new Date();
    loggedIn = true;
    step = 'main';
    toggleFlag.showImportWalletsDialog(false);
  }

  async function checkPin(e, silent = false) {
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

      if (!silent) {
        utils.eventBus.trigger('pin-success', conf.myPin);
      }
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

      let network = newWallet.network || conf.currentTonServer || conf.tonServerKeys[0];

      const phrases = await utils.storage.push('myPhrases', {...newWallet, phrase: result.phrase, network}, pin);

      conf.myPin = pin;
      step = 'main';
      loggedIn = true;

      utils.eventBus.trigger('pin-success', conf.myPin);
    });
  }

  let apiParams = null;

  function onApiCall(params) {
    apiParams = params;
    conf.apiId = apiParams.apiId;
    conf.apiTabId = apiParams.tabId;
  }

  function signIn(e) {
    newWallet = e.detail;
    step = 'createPin';
  }

  async function logout() {
    toggleFlag.showLogoutDialog(false);
    await utils.storage.remove('myPhrases');
    loggedIn = false;
    step = 'login';
  }

  async function backupWallets() {
    const payload = await utils.storage.get(['myPhrases', 'myStickers']);
    const filename = `wallets_${(new Date()).toISOString().split('.')[0].split('T').join('_')}.json`;
    utils.saveToFile(JSON.stringify(payload), filename);
  }

  const setPinFromBg = (pin) => {
    checkPin({detail: pin}, true);
  };

  svelte.onMount(async () => {
    conf.apiId = null;
    conf.apiTabId = null;
    utils.eventBus
      .on('close-popup', window.close)
      .on('oberton-api-call', onApiCall)
      .on('set-pin-from-bg', setPinFromBg);

    setTimeout(() => {
      utils.eventBus
        .trigger('popup-ready', true)
        .trigger('ask-for-pin', true);
    });

    await utils.storage.set({locale: currentLocale});

    const result = await utils.storage.get(['myPhrases']);
    name = result;
    initTime = +new Date();

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

  svelte.onDestroy(() => {
    utils.eventBus
      .off('close-popup', window.close)
      .off('oberton-api-call', onApiCall)
      .off('set-pin-from-bg', setPinFromBg);
  });
</script>

import 'stylesheets/main.scss';

let passphrase;
let logoutButton;

async function renderPhraseForm(app) {
  const form = await $cmp.passphraseForm(app, {}, {
    onCreateWallet: async () => {
      const { phrase } = await tonMethods.createWallet();
      passphrase = phrase;
      form.destroy();
      createPin(app);
    },
    onSubmit: (phrase) => {
      passphrase = phrase;
      form.destroy();
      createPin(app);
    },
  });
}

async function createPin(app) {
  const pinForm = await $cmp.pinForm(app, {
    title: 'Create PIN',
    placeholder: 'It will only work on this device',
  }, {
    goBack: async () => {
      pinForm.destroy();
      await $cmp.wallets(app);
    },
    onSubmit: (pin) => {
      pinForm.destroy();
      confirmPin(app, pin);
    },
  });
}

async function confirmPin(app, prevPin) {
  const pinForm = await $cmp.pinForm(app, {
    title: 'Confirm PIN',
    placeholder: 'Repeat PIN from step before',
    prevPin,
  }, {
    onSubmit: async (pin) => {
      // const phraseEncrypted = utils.crypto.encrypt(passphrase, pin);
      const network = conf.currentTonServer || conf.tonServers[0];
      const phrases = await utils.storage.push('myPhrases', {passphrase, network}, pin);
      // phraseEncrypted});

      logoutButton.style.display = 'inline-block';
      pinForm.destroy();
      await $cmp.wallets(app, {phrases});
      passphrase = null;
    },
    goBack: () => {
      pinForm.destroy();
      createPin(app);
    },
  });
}

async function renderApp(app) {
  app.innerHTML = '';

  logoutButton = document.getElementById('logout-button');
  let pinForm;

  const logout = async () => {
    await utils.storage.remove('myPhrases');
    logoutButton.style.display = 'none';
    if (app && app.currentComponent && app.currentComponent.destroy) {
      app.currentComponent.destroy();
    }
    renderPhraseForm(app);
  };

  logoutButton.addEventListener('click', logout);

  const result = await utils.storage.get(['myPhrases']);

  if (result && result.myPhrases) {
    logoutButton.style.display = 'inline-block';
    pinForm = await $cmp.pinForm(app, {
      title: 'Enter PIN',
    }, {
      onSubmit: async (pin) => {
        const phrases = await utils.storage.getArrayValue('myPhrases', pin);
        if (!phrases) {
          pinForm.onError();
          return;
        }
        pinForm.destroy();
        conf.myPin = pin;
        await $cmp.wallets(app, {phrases});
        passphrase = null;
      },
    });
  } else {
    renderPhraseForm(app);
  }
}

import App from './components/App.svelte';

function startApp() {
  const target = document.getElementById('app');

  const app = new App({
    target,
  })

  if (NODE_ENV !== 'production') {
    window.tonClient  = tonClient;
    window.tonMethods = tonMethods;
    window.app        = app;
    window.conf       = conf;
    window.$cmp       = $cmp;
    window.utils      = utils;
  }
  // renderApp(app);
}

document.addEventListener('DOMContentLoaded', startApp);

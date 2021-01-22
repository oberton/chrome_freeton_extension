import 'stylesheets/main.scss';

let passphrase;
let logoutButton;

function renderPhraseForm(app) {
  const form = $cmp.passphraseForm(app, {}, {
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

function createPin(app) {
  const pinForm = $cmp.pinForm(app, {
    title: 'Create PIN',
    placeholder: 'It will only work on this device',
  }, {
    goBack: () => {
      pinForm.destroy();
      $cmp.phrase(app);
    },
    onSubmit: (pin) => {
      pinForm.destroy();
      confirmPin(app, pin);
    },
  });
}

function confirmPin(app, prevPin) {
  const pinForm = $cmp.pinForm(app, {
    title: 'Confirm PIN',
    placeholder: 'Repeat PIN from step before',
    prevPin,
  }, {
    onSubmit: (pin) => {
      const phraseEncrypted = utils.crypto.encrypt(passphrase, pin);
      utils.storage.set({phraseEncrypted}, () => {
        logoutButton.style.display = 'inline-block';
        pinForm.destroy();
        $cmp.phrase(app, {passphrase});
        passphrase = null;
      });
    },
    goBack: () => {
      pinForm.destroy();
      createPin(app);
    },
  });
}

function renderApp(app) {
  app.innerHTML = '';

  logoutButton = document.getElementById('logout-button');
  let pinForm;

  const logout = () => {
    utils.storage.remove('phraseEncrypted', () => {
      logoutButton.style.display = 'none';
      if (app && app.currentComponent && app.currentComponent.destroy) {
        app.currentComponent.destroy();
      }
      renderPhraseForm(app);
    });
  };

  logoutButton.addEventListener('click', logout);

  utils.storage.get(['phraseEncrypted'], (result) => {
    if (result && result.phraseEncrypted) {
      logoutButton.style.display = 'inline-block';
      pinForm = $cmp.pinForm(app, {
        title: 'Enter PIN',
      }, {
        onSubmit: (pin) => {
          passphrase = utils.crypto.decrypt(result.phraseEncrypted, pin);
          if (!passphrase) {
            pinForm.onError();
            return;
          }
          pinForm.destroy();
          $cmp.phrase(app, {passphrase});
          passphrase = null;
        },
      });
    } else {
      renderPhraseForm(app);
    }
  });
}

function startApp() {
  const app = document.getElementById('app');

  if (NODE_ENV !== 'production') {
    window.tonClient  = tonClient;
    window.tonMethods = tonMethods;
    window.app        = app;
    window.conf       = conf;
    window.$cmp       = $cmp;
    window.utils      = utils;
  }
  renderApp(app);
}

document.addEventListener('DOMContentLoaded', startApp);

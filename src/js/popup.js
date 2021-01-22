import 'stylesheets/main.scss';
import * as storage from './utils/storage';

import { encrypt, decrypt } from './utils/crypto';
// import * as eventBus from './utils/eventBus';

import renderPassphraseForm from './components/passphraseForm';
import renderPinForm from './components/pinForm';
import renderPhrase from './components/phrase';

let passphrase;
let logoutButton;

function renderPhraseForm(app) {
  const form = renderPassphraseForm(app, {}, {
    onSubmit: (phrase) => {
      passphrase = phrase;
      form.destroy();
      createPin(app);
    },
  });
}

function createPin(app) {
  const pinForm = renderPinForm(app, {
    title: 'Create PIN',
    placeholder: 'It will only work on this device',
  }, {
    goBack: () => {
      pinForm.destroy();
      renderPhraseForm(app);
    },
    onSubmit: (pin) => {
      pinForm.destroy();
      confirmPin(app, pin);
    },
  });
}

function confirmPin(app, prevPin) {
  const pinForm = renderPinForm(app, {
    title: 'Confirm PIN',
    placeholder: 'Repeat PIN from step before',
    prevPin,
  }, {
    onSubmit: (pin) => {
      const phraseEncrypted = encrypt(passphrase, pin);
      storage.set({phraseEncrypted}, () => {
        logoutButton.style.display = 'inline-block';
        pinForm.destroy();
        renderPhrase(app, {passphrase});
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
    storage.remove('phraseEncrypted', () => {
      logoutButton.style.display = 'none';
      if (app && app.currentComponent && app.currentComponent.destroy) {
        app.currentComponent.destroy();
      }
      renderPhraseForm(app);
    });
  };

  logoutButton.addEventListener('click', logout);

  storage.get(['phraseEncrypted'], (result) => {
    if (result && result.phraseEncrypted) {
      logoutButton.style.display = 'inline-block';
      pinForm = renderPinForm(app, {
        title: 'Enter PIN',
      }, {
        onSubmit: (pin) => {
          passphrase = decrypt(result.phraseEncrypted, pin);
          if (!passphrase) {
            pinForm.onError();
            return;
          }
          pinForm.destroy();
          renderPhrase(app, {passphrase});
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
    window.tonClient = tonClient;
    window.tonMethods = tonMethods;
    window.app = app;
    window.conf = conf;
  }
  renderApp(app);
}

document.addEventListener('DOMContentLoaded', startApp);

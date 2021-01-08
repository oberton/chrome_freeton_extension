import 'stylesheets/main.scss';

import { encrypt, decrypt } from './utils/crypto';
// import * as eventBus from './utils/eventBus';

import renderPassphraseForm from './components/passphraseForm';
import renderPinForm from './components/pinForm';
import renderPhrase from './components/phrase';

let passphrase;
let logoutButton;

function confirmPin(app, prevPin) {
  const pinForm = renderPinForm(app, {
    title: 'Confirm PIN',
    placeholder: 'Repeat PIN from step before',
    prevPin,
  }, {
    onSubmit: (pin) => {
      const phraseEncrypted = encrypt(passphrase, pin);
      chrome.storage.local.set({phraseEncrypted}, () => {
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

function createPin(app) {
  const pinForm = renderPinForm(app, {
    title: 'Create PIN',
    placeholder: 'It will only work on this device',
  }, {
    onSubmit: (pin) => {
      pinForm.destroy();
      confirmPin(app, pin);
    },
  });
}

function renderPhraseForm(app) {
  const form = renderPassphraseForm(app, {}, {
    onSubmit: (phrase) => {
      passphrase = phrase;
      form.destroy();
      createPin(app);
    },
  });
}


function startApp() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  logoutButton = document.getElementById('logout-button');
  let pinForm;

  const logout = () => {
    chrome.storage.local.remove('phraseEncrypted', () => {
      logoutButton.style.display = 'none';
      if (pinForm && pinForm.destroy) {
        pinForm.destroy();
        pinForm = null;
        renderPhraseForm(app);
      }
    });
  };

  logoutButton.addEventListener('click', logout);

  chrome.storage.local.get(['phraseEncrypted'], (result) => {
    if (result && result.phraseEncrypted) {
      logoutButton.style.display = 'inline-block';
      pinForm = renderPinForm(app, {
        title: 'Enter PIN',
      }, {
        onSubmit: (pin) => {
          let passphrase = decrypt(result.phraseEncrypted, pin);
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

document.addEventListener('DOMContentLoaded', startApp);

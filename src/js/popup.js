import 'stylesheets/main.scss';

import { encrypt, decrypt } from './utils/crypto';
import * as eventBus from './utils/eventBus';

import renderPassphraseForm from './screens/passphraseForm';
import renderPinCodeForm from './screens/pinCodeForm';

document.addEventListener('DOMContentLoaded', () => {
  let passphrase;

  const app = document.getElementById('app');

  const form = renderPassphraseForm(app);

  const encrypted = encrypt('hello', 'world');
  const decrypted = decrypt(encrypted, 'world');

  eventBus.on('form-submit', ({ detail}) => {
    const div = document.createElement('div');
    passphrase = detail;

    form.destroy();

    const pinForm = renderPinCodeForm(app);
  });

  console.log({
    encrypted,
    decrypted,
  });
});

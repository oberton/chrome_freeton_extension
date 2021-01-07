import CryptoJS from 'crypto-js';

function hashString(string, steps = 9) {
  const result = [CryptoJS.SHA512(string).toString()];
  for (let i = 0; i <= steps; i += 1) {
    result.push(CryptoJS.SHA512(result.join(' ')).toString());
  }
  return result.join(' ');
}

export function decrypt(string, password) {
  const passwordHash = hashString(password);
  const decrypted = CryptoJS.AES.decrypt(string, passwordHash, 256);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

export function encrypt(string, password) {
  const passwordHash = hashString(password);

  const encrypted = CryptoJS.AES.encrypt(string, passwordHash, 256);
  return encrypted.toString();
}

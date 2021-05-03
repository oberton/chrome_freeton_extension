export default async function phraseToKeys(phrase) {

  const keys = await conf.tonClient.crypto.mnemonic_derive_sign_keys({
    phrase,
    path: "m/44'/396'/0'/0/0",
    dictionary: 1,
    word_count: (phrase || '').split(' ').length || 12,
  });

  return keys;
}

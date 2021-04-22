import getWalletByKeys from './getWalletByKeys';

async function createWallet(_phrase, isNew, _options = {}, contract = null) {
  let phrase = _phrase;

  const options = _.assign({
    word_count: (phrase || '').split(' ').length() || 12,
    dictionary: 1,
  }, _options);

  if (!phrase) {
    const clientPhrase = await conf.tonClient.crypto.mnemonic_from_random(options);
    phrase = clientPhrase.phrase;
  }

  const keys = await conf.tonClient.crypto.mnemonic_derive_sign_keys({
    phrase,
    path: "m/44'/396'/0'/0/0",
    ...options,
  });

  if (conf.myPin && isNew) {
    const network = conf.tonClient.config.network.server_address;
    const payload = {
      phrase,
      network,
    };

    if (contract && contract !== conf.contracts[0]) {
      payload.contract = contract;
    }

    await utils.storage.push('myPhrases', payload, conf.myPin);
  }

  const wallet = await getWalletByKeys(keys);

  return {
    keys,
    wallet,
    phrase,
  };
}

export default createWallet;

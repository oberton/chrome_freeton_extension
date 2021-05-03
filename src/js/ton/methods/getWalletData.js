import getWalletByKeys from './getWalletByKeys';
import phraseToKeys from './phraseToKeys';
import addNewWallet from './addNewWallet';

/**
  * @param {String} master phrase
  * @param {Boolean} push to storage or not
  * @param {Object} phrase options[dictionary, word_count] etc
  * @param {String} contract file name defined in conf.contracts
  * @returns {Object} wallet data (keys, additional wallet props and phrase itself)
  */
async function getWalletData(_phrase, isNew, _options = {}, contract = null) {
  let phrase = _phrase;

  const options = _.assign({
    word_count: (phrase || '').split(' ').length || 12,
    dictionary: 1,
  }, _options);

  if (!phrase) {
    const clientPhrase = await conf.tonClient.crypto.mnemonic_from_random(options);
    phrase = clientPhrase.phrase;
  }

  const keys = await phraseToKeys(phrase);

  if (conf.myPin && isNew) {
    const payload = { phrase };

    if (contract && contract !== conf.contracts[0].file) {
      payload.contract = contract;
    }

    await addNewWallet(payload);
  }

  const wallet = await getWalletByKeys(keys, contract);

  return {
    keys,
    wallet,
    phrase,
  };
}

export default getWalletData;

import fetchAbi from './fetchAbi';
import fetchTvc from './fetchTvc';

async function createWallet(_phrase, isNew) {
  let phrase = _phrase;

  if (!phrase) {
    const clientPhrase = await conf.tonClient.crypto.mnemonic_from_random({words_count: 12, dictionary: 1});
    phrase = clientPhrase.phrase;
  }

  const keys   = await conf.tonClient.crypto.mnemonic_derive_sign_keys({
    phrase,
    words_count: 12,
    path: "m/44'/396'/0'/0/0",
    dictionary: 1,
  });

  const signer = {
    keys,
    type: 'Keys',
  };

  const callSet = {
    function_name: 'constructor',
    header: {
      pubkey: keys.public,
    },
    input: {
      owners: [
        `0x${keys.public}`,
      ],
      reqConfirms: 1,
    },
  };

  const tvc = await fetchTvc();

  const deploySet = {
    tvc,
  };

  const abiValue = await fetchAbi();

  const abi = {
    value: abiValue,
    type: 'Serialized',
  };

  const payloadEncodeMessage = {
    abi,
    deploy_set: deploySet,
    call_set: callSet,
    signer,
  };

  const wallet = await conf.tonClient.abi.encode_message(payloadEncodeMessage);

  if (conf.myPin && isNew) {
    const network = conf.tonClient.config.network.server_address;
    await utils.storage.push('myPhrases', {phrase, network}, conf.myPin);
  }

  return {
    keys,
    wallet,
    phrase,
  };
}

export default createWallet;

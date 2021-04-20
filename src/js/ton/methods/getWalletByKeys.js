import fetchAbi from './fetchAbi';
import fetchTvc from './fetchTvc';

async function getWalletByKeys(keys) {
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

  return wallet;
}

export default getWalletByKeys;

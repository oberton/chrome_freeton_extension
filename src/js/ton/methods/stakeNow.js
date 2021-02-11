import fetchAbi from './fetchAbi';
import fetchTvc from './fetchTvc';

async function stakeNow(walletData, stakeForm) {

  let stake = 13 * 1000000000;

  const client = new tonClient({
    network: {
      server_address: conf.currentTonServer || conf.tonServers[0],
    },
  });

  let abiValue = await fetchAbi('/sig-files/DePool.abi.json');

  let abi = {
    type: 'Serialized',
    value: abiValue,
  };

  let call_set = {
    function_name: 'addOrdinaryStake',
    input: {
      stake: stake,
    },
  };

  let signer = {
    type: 'None',
  };

  const depoolPayload = {
    abi,
    call_set,
    signer,
    is_internal: true,
  };

  let message = null;

  message = await client.abi.encode_message_body(depoolPayload);

  abiValue = await fetchAbi();

  abi = {
    type: 'Serialized',
    value: abiValue,
  };

  call_set = {
    function_name: 'sendTransaction',
    input: {
      dest: '0:93c5a151850b16de3cb2d87782674bc5efe23e6793d343aa096384aafd70812c',
      value: stake + 0.5 * 1000000000,
      bounce: true,
      flags: 1,
      payload: message.body,
    },
  };

  signer = {
    type: 'Keys',
    keys: walletData.keys,
  };

  const message_encode_params = {
    address: walletData.wallet.address,
    abi,
    call_set,
    signer,
  };

  message = await client.abi.encode_message(message_encode_params);

  const paramsOfSendMessage = {
    message: message.message,
    abi,
    send_events: true,
  };

  let result = null;

  const processParams = {
    message_encode_params,
    send_events: false,
  };

  result = await client.processing.process_message(processParams);

  debugger

  return;
}

export default stakeNow;

import fetchAbi from './fetchAbi';
import fetchTvc from './fetchTvc';

async function stakeNow(walletData, stakeForm) {

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
      stake: 13,
    },
  };

  let signer = {
    type: 'None',
  };

  const depoolPayload = {
    address: '0:93c5a151850b16de3cb2d87782674bc5efe23e6793d343aa096384aafd70812c',
    abi,
    call_set,
    signer,
  };

  let message = await client.abi.encode_message(depoolPayload);

// address: "0:93c5a151850b16de3cb2d87782674bc5efe23e6793d343aa096384aafd70812c"
// data_to_sign: null
// message: "te6ccgEBAQEAPQAAdYgBJ4tCowoWLbx5ZbDvBM6Xi9/EfM8npodUEscJVfrhAlgAAAAF3htvq6WAihkcKrBj9AAAAAAAAAA2"
// message_id:

  abiValue = await fetchAbi();

  abi = {
    type: 'Serialized',
    value: abiValue,
  };

  call_set = {
    function_name: 'sendTransaction',
    input: {
      dest: depoolPayload.address,
      value: 1000000000,
      bounce: true,
      flags: 1,
      payload: message.message,
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

  debugger

  const paramsOfSendMessage = {
    message: message.message,
    abi,
    send_events: true,
  };

  let result = await client.processing.send_message(paramsOfSendMessage);

  const paramsOfWaitForTransaction = {
    abi,
    message: message.message,
    shard_block_id: result.shard_block_id,
    send_events: true,
  };

  // const processParams = {
  //   message_encode_params,
  //   send_events: false,
  // };

    // const result = await client.processing.process_message(processParams);
  result = await client.processing.wait_for_transaction(paramsOfWaitForTransaction);

  debugger

  return;
}

export default stakeNow;

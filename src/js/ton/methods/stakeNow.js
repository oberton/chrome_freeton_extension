import fetchAbi from './fetchAbi';
import fetchTvc from './fetchTvc';


async function getCustodians1(client, abiDir) {
  // const client = new tonClient({
  //   network: {
  //     server_address: conf.currentTonServer || conf.tonServers[0],
  //   },
  // });

  let result = await client.net.wait_for_collection({
    collection: 'accounts',
    filter: {
      id: {
        eq: '0:428c93d1dad5fe1f3e1bf19e42939891bcf44f02bfd90fbcaa24bbbd9c4446bb',
      },
    },
    result: 'id balance(format: DEC) boc',
    timeout: 4000,
  });

  let parseMessage = {
    boc: result.result.boc
  }
  
  result = await client.boc.parse_account(parseMessage);
  
  debugger;

  return;
}

async function getCustodians(client, address, abiDir, keys) {

  let account = await client.net.query_collection({
      collection: 'accounts',
      filter: { id: { eq: address } },
      result: 'boc'
  })

  let abiValue = await fetchAbi(abiDir);

  const message_encode_params = {
    address: address,
    abi: {
      type: 'Serialized',
      value: abiValue,
    },
    call_set: {
      function_name: 'getCustodians',
      input: {}
    },
    signer: {
      type: 'None'
    }
  };

  let encoded_message = await client.abi.encode_message(message_encode_params);

  let response = await client.tvm.run_tvm({ 
    message: encoded_message.message, 
    account: account.result[0].boc, 
    abi: {
      type: 'Serialized',
      value: abiValue,
    } 
  });
  
  return response.decoded.output.custodians;
}

async function getTransactionIds(client, address, abiDir, keys) {

  let account = await client.net.query_collection({
      collection: 'accounts',
      filter: { id: { eq: address } },
      result: 'boc'
  })

  let abiValue = await fetchAbi(abiDir);

  const message_encode_params = {
    address: address,
    abi: {
      type: 'Serialized',
      value: abiValue,
    },
    call_set: {
      function_name: 'getTransactionIds',
      input: {}
    },
    signer: {
      type: 'None'
    }
  };

  let encoded_message = await client.abi.encode_message(message_encode_params);
  
  let response = await client.tvm.run_tvm({ 
    message: encoded_message.message, 
    account: account.result[0].boc, 
    abi: {
      type: 'Serialized',
      value: abiValue,
    } 
  });
  
  return response.decoded.output.ids;
}



async function stakeNow(walletData, stakeForm) {

  

  const client = new tonClient({
    network: {
      server_address: conf.currentTonServer || conf.tonServers[0],
    },
  });

  // let a = await test();

  let custodians = await getCustodians(client, walletData.wallet.address, '/sig-files/SetcodeMultisigWallet.abi.json', walletData.keys);
  console.log(custodians);

  custodians = await getTransactionIds(client, walletData.wallet.address, '/sig-files/SetcodeMultisigWallet.abi.json', walletData.keys);
  console.log(custodians);

  return;

  



  // Ordinary Stake Example

  let stake = 13 * 1000000000;

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

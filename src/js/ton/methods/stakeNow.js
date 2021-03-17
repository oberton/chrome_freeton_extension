import fetchAbi from './fetchAbi';
import fetchTvc from './fetchTvc';
const DepoolsCodeHashes = {
  1: "b4ad6c42427a12a65d9a0bffb0c2730dd9cdf830a086d94636dab7784e13eb38", // 1
  2: "a46c6872712ec49e481a7f3fc1f42469d8bd6ef3fae906aa5b9927e5a3fb3b6b", // 2
  3: "14e20e304f53e6da152eb95fffc993dbd28245a775d847eed043f7c78a503885", // 3
}

// получить массив публичных ключей кастодианов
async function getCustodians(client, address, abiWalletDir) {

  let account = await client.net.query_collection({
      collection: 'accounts',
      filter: { id: { eq: address } },
      result: 'boc'
  })

  let abiValue = await fetchAbi(abiWalletDir);

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


// есть ли транзакции для подтверждения другими кастодианами у кошелька
async function getTransactionIds(client, address, abiWalletDir) {

  let account = await client.net.query_collection({
      collection: 'accounts',
      filter: { id: { eq: address } },
      result: 'boc'
  })

  let abiValue = await fetchAbi(abiWalletDir);

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

async function getAccountType(client, address) {
  let account = await client.net.query_collection({
      collection: 'accounts',
      filter: { id: { eq: address } },
      result: 'acc_type_name'
  })

  return account.result[0].acc_type_name;
}


// аккаунт активный или нет true false
async function accountIsActive(client, address) {
  let accountType = await getAccountType(client, address);

  return accountType == 'Active';
}


// вернуть весь стейк
async function withdrawAll(client, walletAddr, keys, depoolAddr, abiDepoolDir, abiWalletDir) {
  let abiValue = await fetchAbi(abiDepoolDir);

  let abi = {
    type: 'Serialized',
    value: abiValue,
  };

  let call_set = {
    function_name: 'withdrawAll',
    input: {}
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

  abiValue = await fetchAbi(abiWalletDir);

  abi = {
    type: 'Serialized',
    value: abiValue,
  };

  call_set = {
    function_name: 'sendTransaction',
    input: {
      dest: depoolAddr,
      value: 0.5 * 1000000000,
      bounce: true,
      flags: 1,
      payload: message.body,
    },
  };

  signer = {
    type: 'Keys',
    keys: keys,
  };

  const message_encode_params = {
    address: walletAddr,
    abi,
    call_set,
    signer,
  };

  message = await client.abi.encode_message(message_encode_params);

  const processParams = {
    message_encode_params,
    send_events: false,
  };

  let result = await client.processing.process_message(processParams);

  return result;
}

// получить кол-во записей для аккаунтов. Фильтруется по массиву хешей кода от аккаунтов
async function getAccountsCount(client, code_hashes=[]) {

  let fetch = await client.net.aggregate_collection({
      collection: 'accounts',
      filter: { 
        code_hash: { 
          in: code_hashes
        } 
      }
      // ,
      // fields: [
      //   {fn: 'COUNT'}
      // ],
      // result: ''
  })

  return Number(fetch.values[0]);
}

// получить список аккаунтов по массиву хешей кода от аккаунтов, игнорируя определенные аккаунты из массива ignoreIds. Максимум записей - 50шт
async function getAccountsList(client, code_hashes=[], limit=50, ignoreIds=[]) {

  let filter = {
    code_hash: { 
      in: code_hashes
    } 
  };

  if (ignoreIds) {
    filter.id = {
      notIn: ignoreIds
    }
  }

  

  let fetch = await client.net.query_collection({
      collection: 'accounts',
      filter: filter,
      orderBy:[
        {path: 'id', direction: 'ASC'},
      ],
      limit: limit,
      result: 'id balance(format: DEC) code_hash acc_type_name'
  })

  return fetch.result;
}

// получить список абсолютно всех аккаунтов по массиву хешей кода от аккаунтов
async function getAllAccountsList(client, depools_code_hashes=[]) {
  let count = await getAccountsCount(client, depools_code_hashes);
  console.log('c', count)
  let accounts = [];
  let ignoreIds = [];
  
  while(count > 0) {
    let fetch = await getAccountsList(client, depools_code_hashes, 50, ignoreIds);
    if (fetch.length > 0) {
      for (let i = 0; i < fetch.length; i++) {
        ignoreIds.push(fetch[i].id);
      }
    }
    console.log('fetch', fetch);
    accounts = accounts.concat(fetch);
    count = count - fetch.length;

    if (fetch.length == 0 && count > 0) { console.log('ERROR, List accounts not loaded. Diff equal', count); break; }
  }

  return accounts;
}












async function stakeNow(client, walletAddr, keys, depoolAddr, abiDepoolDir, abiWalletDir, amountToken) {
  
  if (client == undefined || client == null) {
    client = new tonClient({
      network: {
        server_address: conf.currentTonServer || conf.tonServers[0],
      },
    })
  }

  // let custodians = await getCustodians(client, walletAddr, abiWalletDir);
  // let custodians = await getTransactionIds(client, walletAddr, abiWalletDir);

  // debugger;
  // debugger;

  let depools_code_hashes = Object.values(DepoolsCodeHashes);

  // let custodians = await getAccountsCount(client, depools_code_hashes);
  // let custodians = await getAccountsList(client, depools_code_hashes, 50, []);
  let custodians = await getAllAccountsList(client, depools_code_hashes);
  console.log(custodians);

  // let a = await withdrawAll(client, walletAddr, keys, depoolAddr, abiDepoolDir, abiWalletDir);
  // console.log(a);



  return;

  

  // Ordinary Stake Example

  let stake = amountToken * 1000000000;

  let abiValue = await fetchAbi(abiDepoolDir);

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

  abiValue = await fetchAbi(abiWalletDir);

  abi = {
    type: 'Serialized',
    value: abiValue,
  };

  call_set = {
    function_name: 'sendTransaction',
    input: {
      dest: depoolAddr,
      value: stake + 0.5 * 1000000000,
      bounce: true,
      flags: 1,
      payload: message.body,
    },
  };

  signer = {
    type: 'Keys',
    keys: keys,
  };

  const message_encode_params = {
    address: walletAddr,
    abi,
    call_set,
    signer,
  };

  message = await client.abi.encode_message(message_encode_params);

  const processParams = {
    message_encode_params,
    send_events: false,
  };

  let result = await client.processing.process_message(processParams);

  debugger

  return result;
}

export default stakeNow;

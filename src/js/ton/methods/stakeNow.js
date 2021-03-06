import fetchAbi from './fetchAbi';
import fetchTvc from './fetchTvc';
const DepoolsCodeHashes = {
  1: "b4ad6c42427a12a65d9a0bffb0c2730dd9cdf830a086d94636dab7784e13eb38", // 1
  2: "a46c6872712ec49e481a7f3fc1f42469d8bd6ef3fae906aa5b9927e5a3fb3b6b", // 2
  3: "14e20e304f53e6da152eb95fffc993dbd28245a775d847eed043f7c78a503885", // 3
}

// получить массив публичных ключей кастодианов
async function getCustodians(address, abiWalletDir) {

  let account = await conf.tonClient.net.query_collection({
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

  let encoded_message = await conf.tonClient.abi.encode_message(message_encode_params);

  let response = await conf.tonClient.tvm.run_tvm({ 
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
async function getTransactionIds(address, abiWalletDir) {

  let account = await conf.tonClient.net.query_collection({
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

  let encoded_message = await conf.tonClient.abi.encode_message(message_encode_params);
  
  let response = await conf.tonClient.tvm.run_tvm({ 
    message: encoded_message.message, 
    account: account.result[0].boc, 
    abi: {
      type: 'Serialized',
      value: abiValue,
    } 
  });
  
  return response.decoded.output.ids;
}

async function getAccountType(address) {
  let account = await conf.tonClient.net.query_collection({
      collection: 'accounts',
      filter: { id: { eq: address } },
      result: 'acc_type_name'
  })

  return account.result[0].acc_type_name;
}


// аккаунт активный или нет true false
async function accountIsActive(address) {
  let accountType = await getAccountType(address);

  return accountType == 'Active';
}


// вернуть весь стейк
async function withdrawAll(walletAddr, keys, depoolAddr, abiDepoolDir, abiWalletDir) {
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

  message = await conf.tonClient.abi.encode_message_body(depoolPayload);

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

  message = await conf.tonClient.abi.encode_message(message_encode_params);

  const processParams = {
    message_encode_params,
    send_events: false,
  };

  let result = await conf.confClient.processing.process_message(processParams);

  return result;
}

// получить кол-во записей для аккаунтов. Фильтруется по массиву хешей кода от аккаунтов
async function getAccountsCount(code_hashes=[]) {

  let fetch = await conf.tonClient.net.aggregate_collection({
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
async function getAccountsList(code_hashes=[], limit=50, ignoreIds=[]) {

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

  

  let fetch = await conf.tonClient.net.query_collection({
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
async function getAllAccountsList(depools_code_hashes=[]) {
  let count = await getAccountsCount(depools_code_hashes);
  console.log('c', count)
  let accounts = [];
  let ignoreIds = [];
  
  while(count > 0) {
    let fetch = await getAccountsList(depools_code_hashes, 50, ignoreIds);
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





String.prototype.hexEncode = function() {
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}

String.prototype.hexDecode = function() {
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}

const transferAbi = {
    "ABI version": 2,
    "functions": [
        {
            "name": "transfer",
            "id": "0x00000000",
            "inputs": [{"name":"comment","type":"bytes"}],
            "outputs": []
        }
    ],
    "events": [],
    "data": []
}

// amount - размерность в TON
async function sendToken(client, from, to, amount, keys, abiWalletDir, sendForce=true, comment=null) {

  let body = '';
  if (comment != undefined || comment != null) {
    let signer = {
      type: 'None',
    };

    body = (await client.abi.encode_message_body({
        abi: {
          type: 'Serialized',
          value: transferAbi,
        },
        call_set: {
            function_name: "transfer",
            input:{
                comment: comment.hexEncode()
            }
        },
        is_internal: true,
        signer: signer,
    })).body;  
  }

  let submitTransactionParams = {
      dest: to,
      value: amount * 1_000_000_000,
      bounce: !sendForce,
      allBalance: false,
      payload: body
  };

  let abiValue = await fetchAbi(abiWalletDir);

  let params = {
      send_events: false,
      message_encode_params: {
          address: from,
          abi: {
            type: 'Serialized',
            value: abiValue,
          },
          call_set: {
              function_name: 'submitTransaction',
              input: submitTransactionParams
          },

          signer: {
              type: 'Keys',
              keys: keys
          },
      }
  }

  // console.log(params);

  let transactionInfo = await client.processing.process_message(params);
  
  // console.log("Transaction info:")
  // console.log(transactionInfo);

  // console.log("Id:")
  // console.log(transactionInfo.transaction.id);

  // console.log("messages:")
  // console.log(transactionInfo.out_messages);

  // const messages = transactionInfo.out_messages;
  // try{
  //     const decoded_comment1 = (await client.abi.decode_message({
  //         abi: transferAbi, 
  //         message: messages[0]
  //     })).value;
          
  //     console.log(decoded_comment1);

  //     const decoded_comment2 = (await client.abi.decode_message({
  //         abi: transferAbi, 
  //         message: messages[1]
  //     })).value;
  //     console.log(decoded_comment2.toString);
  // } catch {

  // }

  return transactionInfo;
}



// async function deploySurfWallet(keys, abiDir, tvcDir, expectedAddress) {
//   console.log(keys);
//   return await deployStandardWalletContract(keys, abiDir, tvcDir, [`0x${keys.public}`], expectedAddress);
// }
// 
// async function deploySafeMultisigWallet(keys, abiDir, tvcDir, owners, expectedAddress, reqConfirms) {
//   return await deployStandardWalletContract(keys, abiDir, tvcDir, owners, expectedAddress);
// }


// подтвердить транзакцию
async function confirmTransaction(walletAddr, transactionId, abiWalletDir, custodianKeys) {

  if (transactionId == undefined || transactionId == null || transactionId.length == 0) {
    return;
  }

  let abiValue = await fetchAbi(abiWalletDir);

  let params = {
      send_events: false,
      message_encode_params: {
          address: walletAddr,
          abi: {
            type: 'Serialized',
            value: abiValue,
          },
          call_set: {
              function_name: 'confirmTransaction',
              input: {
                transactionId: transactionId //string
              }
          },
          signer: {
              type: 'Keys',
              keys: custodianKeys
          },
      }
  }

  let result = await conf.tonClient.processing.process_message(params);

  return result;
}

// подтвердить все существующие транзакции
async function confirmAllTransactions(walletAddr, abiWalletDir, custodianKeys) {
  let transactionIds = await getTransactionIds(walletAddr, abiWalletDir);

  let i;
  for (i = 0; i < transactionIds.length; i++) {
    let transactionId = transactionIds[i];
    await confirmTransaction(walletAddr, transactionId, abiWalletDir, custodianKeys);
  }
}


// получить кол-во транзакций для аккаунта
async function getTransactionsCount(accountAddr) {

  let fetch = await conf.tonClient.net.aggregate_collection({
      collection: 'transactions',
      filter: { 
        account_addr: { 
          eq: accountAddr
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

// получить список транзакций по аккаунту, игнорируя транзакции по id из массива ignoreIds. Максимум записей - 50шт
async function getTransactionList(accountAddr, limit=50, ignoreIds=[]) {

  let filter = {
    account_addr: { 
      eq: accountAddr
    } 
  };

  if (ignoreIds) {
    filter.id = {
      notIn: ignoreIds
    }
  }

  let fetch = await conf.tonClient.net.query_collection({
      collection: 'transactions',
      filter: filter,
      order:[
        {path: 'lt', direction: 'DESC'},
      ],
      limit: limit,
      result: 'id lt(format: DEC) aborted account_addr in_message{id src dst msg_type_name value(format: DEC) created_at} now total_fees(format: DEC)'
  })

  return fetch.result;
}


// подписка на транзакции
async function subscribeToTransactions(accountAddrs = [], callback = function(){}) {

  let result = await conf.tonClient.net.subscribe_collection(
    {
      collection: 'transactions',
      filter: { 
        account_addr: { 
          in: accountAddrs
        } 
      },
      result: "id account_addr in_message{id src dst msg_type_name value(format: DEC) created_at} now total_fees(format: DEC)"
    },
    callback
  )

  return result;
}

// подписка на изменения аккаунта - баланс
async function subscribeToAccounts(accountAddrs = [], callback = function(){}) {

  let result = await conf.tonClient.net.subscribe_collection(
    {
      collection: 'accounts',
      filter: { 
        id: { 
          in: accountAddrs
        } 
      },
      result: "id balance(format: DEC)"
    },
    callback
  )

  return result;
}


// получить кол-во транзакций для аккаунта
async function unsubscribe(handle) {
  let result = await conf.tonClient.net.unsubscribe({handle: handle});
  return result;
}

// инфо о пендинг транзакции
async function getTransactionInfo(address, abiWalletDir, transactionId) {

  let account = await conf.tonClient.net.query_collection({
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
      function_name: 'getTransaction',
      input: {
        transactionId: transactionId
      }
    },
    signer: {
      type: 'None'
    }
  };

  let encoded_message = await conf.tonClient.abi.encode_message(message_encode_params);
  
  let response = await conf.tonClient.tvm.run_tvm({ 
    message: encoded_message.message, 
    account: account.result[0].boc, 
    abi: {
      type: 'Serialized',
      value: abiValue,
    } 
  });
  
  return response.decoded.output;
}













async function stakeNow(walletAddr, keys, depoolAddr, abiDepoolDir, abiWalletDir, amountToken) {
  walletAddr = keys
  keys = depoolAddr
  
  let setcodeTVCDir = '/sig-files/SetcodeMultisigWallet.tvc'
  let abiSetcodeWalletDir = '/sig-files/SetcodeMultisigWallet.abi.json'
  abiSetcodeWalletDir = 'SetcodeMultisigWallet'
  
  let safeTVCDir = '/sig-files/SafeMultisigWallet.tvc'
  let abiSafeWalletDir = '/sig-files/SafeMultisigWallet.abi.json'
  abiSafeWalletDir = 'SafeMultisigWallet'

  console.log("DEV TOOL");
  console.log(walletAddr);
  console.log(keys);


  // TEST SUBSCRIBE
  let subscribeResult = await subscribeToTransactions([walletAddr], function(val) { console.log(val) });
  let subscribeResult2 = await subscribeToAccounts([walletAddr], function(val) { console.log(val) });
  console.log(subscribeResult);
  console.log(subscribeResult2);
  let handle = subscribeResult.handle;
  let handle2 = subscribeResult2.handle;
  console.log(handle);
  console.log(handle2);
  // let unsubscribeHandle = await unsubscribe(handle);
  // console.log(unsubscribeHandle);

  // getTransactionIds(address, abiWalletDir)

  // let transactionsCount = await getTransactionsCount(walletAddr);
  // console.log(transactionsCount);
  
  // let output = await getTransactionList(walletAddr, 50, []);
  // console.log(output);

  // let output = await getTransactionIds(walletAddr, abiSafeWalletDir);
  // console.log(output);

  // let output = await getTransactionInfo(walletAddr, abiSafeWalletDir, "6958226000927295873");
  // console.log(output);
  
  
  
  
  // let custodians = await getCustodians(walletAddr, abiWalletDir);
  // let custodians = await getTransactionIds(walletAddr, abiWalletDir);

  // debugger;
  // debugger;

  // получить все депулы трех версий
  // let depools_code_hashes = Object.values(DepoolsCodeHashes);
  // let custodians = await getAllAccountsList(depools_code_hashes);
  // console.log(custodians);

  // забрать весь стейк с депула
  // let a = await withdrawAll(walletAddr, keys, depoolAddr, abiDepoolDir, abiWalletDir);
  // console.log(a);

  // отправить токены
  // let a = await tonMethods.sendTokens(
  //   walletAddr, 
  //   '0:122f9c193e2b925e432356ef1e868ee84559696a48845a8b9cf781c67f2c75d9', 
  //   0.1, 
  //   keys, 
  //   abiWalletDir, 
  //   null
  // );
  // let custodians = await getAllAccountsList(client, depools_code_hashes);
  // console.log(custodians);

  // забрать весь стейк с депула
  // let a = await withdrawAll(client, walletAddr, keys, depoolAddr, abiDepoolDir, abiWalletDir);
  // console.log(a);

  // отправить токены
  // let a = await sendToken(
  //   client, 
  //   walletAddr, 
  //   // '0:122f9c193e2b925e432356ef1e868ee84559696a48845a8b9cf781c67f2c75d9', 
  //   '0:6b824a6cc6e879e584bfd88025677c51ac560f2614b7e87d60dc9c8ec884dc96', 
  //   0.1, 
  //   keys, 
  //   abiWalletDir,
  //   false, 
  //   null
  // );
  // console.log(a);



  // Deploy Default Surf Contract
  // let testNewSetcodeWalletAddress = keys // Я хз почему в эту переменную приходит адресс
  // let keysPair = depoolAddr; // Я хз почему в эту переменную приходит пара ключей

  // let r = await deploySurfWallet(keysPair, abiSetcodeWalletDir, setcodeTVCDir, testNewSetcodeWalletAddress)
  // console.log(r);
  








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

  message = await conf.tonClient.abi.encode_message_body(depoolPayload);

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

  message = await conf.tonClient.abi.encode_message(message_encode_params);

  const processParams = {
    message_encode_params,
    send_events: false,
  };

  let result = await conf.tonClient.processing.process_message(processParams);

  debugger

  return result;
}

export default stakeNow;

const DepoolsCodeHashes = {
  1: "b4ad6c42427a12a65d9a0bffb0c2730dd9cdf830a086d94636dab7784e13eb38", // 1
  2: "a46c6872712ec49e481a7f3fc1f42469d8bd6ef3fae906aa5b9927e5a3fb3b6b", // 2
  3: "14e20e304f53e6da152eb95fffc993dbd28245a775d847eed043f7c78a503885", // 3
};

// получить список аккаунтов по массиву хешей кода от аккаунтов, игнорируя определенные аккаунты из массива ignoreIds. Максимум записей - 50шт
async function getAccountsList(client, code_hashes = [], limit = 50, ignoreIds = []) {

  const filter = {
    code_hash: {
      in: code_hashes,
    },
  };

  if (ignoreIds) {
    filter.id = {
      notIn: ignoreIds,
    };
  }

  const fetch = await client.net.query_collection({
    collection: 'accounts',
    filter: filter,
    orderBy:[
      {path: 'id', direction: 'ASC'},
    ],
    limit: limit,
    result: 'id balance(format: DEC) code_hash acc_type_name',
  });

  return fetch.result;
}

async function getAccountsCount(client, code_hashes = []) {
  const fetch = await client.net.aggregate_collection({
    collection: 'accounts',
    filter: {
      code_hash: {
        in: code_hashes,
      },
    },
  });

  return Number(fetch.values[0]);
}

// получить список абсолютно всех аккаунтов по массиву хешей кода от аккаунтов
async function getAllAccountsList(client, depools_code_hashes = []) {
  let count = await getAccountsCount(client, depools_code_hashes);

  let accounts = [];
  const ignoreIds = [];

  while(count > 0) {
    const fetch = await getAccountsList(client, depools_code_hashes, 50, ignoreIds);
    if (fetch.length > 0) {
      for (let i = 0; i < fetch.length; i += 1) {
        ignoreIds.push(fetch[i].id);
      }
    }
    console.log('fetch', fetch);
    accounts = accounts.concat(fetch);
    count -= fetch.length;

    if (fetch.length === 0 && count > 0) {
      console.log('ERROR, List accounts not loaded. Diff equal', count);
      break;
    }
  }

  return accounts;
}

async function getDepools(_client) {

  const client = _client || new tonClient({
    network: {
      server_address: conf.currentTonServer || conf.tonServers[0],
    },
  });

  const depoolsCodeHashes = Object.values(DepoolsCodeHashes);
  const custodians = await getAllAccountsList(client, depoolsCodeHashes);
  return custodians;
}

export default getDepools;

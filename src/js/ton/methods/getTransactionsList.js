/**
  * get transactions list
  *
  * @param {String} wallet address
  * @param {Number} limit of transactions
  * @param {Object} filter
  */
export default async function getTransactionsList(accountAddr, limit = 50, params = {}) {
  const filter = {
    account_addr: {
      eq: accountAddr,
    },
  };

  _.assign(filter, params);

  const response = await conf.tonClient.net.query_collection({
    collection: 'transactions',
    filter: filter,
    order:[
      {path: 'now', direction: 'DESC'},
    ],
    limit: limit,
    result: `id now tr_type tr_type_name account_addr balance_delta(format: DEC) total_fees(format: DEC)`,
  });

  return response.result;
}

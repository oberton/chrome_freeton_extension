/**
  * get transactions list
  *
  * @param {String} wallet address
  * @param {Number} limit of transactions
  * @param {Array} specific transaction ids to fetch
  * @param {Array} ignore transaction ids (loaded before)
  */
export default async function getTransactionsList(accountAddr, limit = 50, includeIds = [], ignoreIds = []) {

  const filter = {
    account_addr: {
      eq: accountAddr,
    },
  };

  if (includeIds) {
    filter.id = {
      in: includeIds,
    };
  }

  if (ignoreIds) {
    filter.id = {
      notIn: ignoreIds,
    };
  }

  const response = await conf.tonClient.net.query_collection({
    collection: 'transactions',
    filter: filter,
    order:[
      {path: 'lt', direction: 'DESC'},
    ],
    limit: limit,
    // result: 'id balance(format: DEC) code_hash acc_type_name'
    result: 'id lt(format: DEC) aborted account_addr in_message{id src dst msg_type_name value(format: DEC) created_at} now total_fees(format: DEC)',
  });

  return response.result;
}

/**
  * get messages list
  *
  * @param {String} wallet address
  * @param {Number} limit of transactions
  * @param {Object} filter
  */
export default async function getTransactionsList(accountAddr, limit = 50, filter = {}) {

  const requestParams = {
    collection: 'messages',
    filter,
    order:[
      {path: 'created_at', direction: 'DESC'},
    ],
    limit,
    result: 'id value(format: DEC) src dst created_at msg_type',
  };

  const response = await conf.tonClient.net.query_collection(requestParams);
  return response.result;
}

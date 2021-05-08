export default async function subscribeForTransactions(accountAddrs = [], callback = () => true) {

  const result = await conf.tonClient.net.subscribe_collection({
    collection: 'transactions',
    filter: {
      account_addr: {
        in: accountAddrs,
      },
    },
    result: `id now tr_type tr_type_name account_addr balance_delta(format: DEC) total_fees(format: DEC)`,
  }, callback);

  return result.handle;
}

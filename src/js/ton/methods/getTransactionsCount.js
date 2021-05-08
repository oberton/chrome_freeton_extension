export default async function getTransactionsCount(accountAddr) {

  const response = await conf.tonClient.net.aggregate_collection({
    collection: 'transactions',
    filter: {
      account_addr: {
        eq: accountAddr,
      },
    },
  });

  return response.values[0];
}

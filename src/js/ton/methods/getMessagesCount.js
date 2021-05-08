export default async function getTransactionsCount(accountAddr) {

  const response1 = await conf.tonClient.net.aggregate_collection({
    collection: 'messages',
    filter: {
      dst: {
        eq: accountAddr,
      },
    },
  });

  const response2 = await conf.tonClient.net.aggregate_collection({
    collection: 'messages',
    filter: {
      src: {
        eq: accountAddr,
      },
    },
  });

  const count = parseInt(response1.values[0], 10) + parseInt(response2.values[0], 10);

  return count;
}

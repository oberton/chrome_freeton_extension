export default async function subscribeToAccounts(accountAddrs = [], callback = () => true) {

  const result = await conf.tonClient.net.subscribe_collection({
    collection: 'accounts',
    filter: {
      id: {
        in: accountAddrs,
      },
    },
    result: "id balance(format: DEC)",
  }, callback);

  return result.handle;
}

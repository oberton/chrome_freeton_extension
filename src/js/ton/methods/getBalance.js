async function getBalance(address) {

  const result = await conf.tonClient.net.wait_for_collection({
    collection: 'accounts',
    filter: {
      id: {
        eq: address,
      },
    },
    result: 'id balance(format: DEC)',
    timeout: 4000,
  });
  return result;
}

export default getBalance;

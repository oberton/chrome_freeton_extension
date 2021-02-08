async function getBalance(address) {
  const client = new tonClient({
    network: {
      server_address: conf.currentTonServer || conf.tonServers[0],
    },
  });

  const result = await client.net.wait_for_collection({
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

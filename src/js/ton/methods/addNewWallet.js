export default async function addNewWallet(_payload) {
  const network = conf.tonClient.config.network.server_address;

  const payload = {
    network,
    ..._payload,
  };

  await utils.storage.push('myPhrases', payload, conf.myPin);
}

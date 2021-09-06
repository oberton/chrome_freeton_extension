import getCurrentNetwork from './getCurrentNetwork';

export default async function addNewWallet(_payload) {
  const network = await getCurrentNetwork();

  const payload = {
    network,
    ..._payload,
  };

  await utils.storage.push('myPhrases', payload, conf.myPin);
}

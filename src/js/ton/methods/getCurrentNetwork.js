async function getCurrentNetwork() {

  conf.tonServerKeys = [
    ..._.keys(conf.tonServers),
    ..._.map(conf.customTonServers, 'id'),
  ];

  let { currentServer } = await utils.storage.get('currentServer');

  if (!_.includes(conf.tonServerKeys, currentServer)) {
    currentServer = conf.tonServerKeys[0];
  }

  return currentServer;
}

export default getCurrentNetwork;

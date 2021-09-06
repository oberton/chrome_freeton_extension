import { TonClient } from "@tonclient/core";
import { libWeb } from "@tonclient/lib-web";

TonClient.useBinaryLibrary(libWeb);

function getClient() {
  const serverKey = conf.currentTonServer || conf.tonServerKeys[0];
  const server = conf.tonServers[serverKey] || _.find(conf.customTonServers, s => s.id === serverKey);
  const endpoints = server.endpoints;

  const client = new TonClient({
    network: {
      endpoints,
    },
  });

  return client;
}

export default getClient;

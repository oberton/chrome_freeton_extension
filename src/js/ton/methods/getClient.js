import { TonClient } from "@tonclient/core";
import { libWeb } from "@tonclient/lib-web";

TonClient.useBinaryLibrary(libWeb);

function getClient() {
  const client = new TonClient({
    network: {
      server_address: conf.currentTonServer || conf.tonServers[0],
    },
  });

  return client;
}

export default getClient;

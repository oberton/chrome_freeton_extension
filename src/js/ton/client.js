import { TonClient } from "@tonclient/core";
import { libWeb } from "@tonclient/lib-web";

TonClient.useBinaryLibrary(libWeb);

window.TonClient = TonClient;

const client = new TonClient({
  network: {
    server_address: conf.tonServers[0],
  },
});

export default client;

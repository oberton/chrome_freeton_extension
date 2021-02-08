import { TonClient } from "@tonclient/core";
import { libWeb } from "@tonclient/lib-web";

TonClient.useBinaryLibrary(libWeb);

export default TonClient;

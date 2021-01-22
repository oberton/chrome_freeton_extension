function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    } catch(e) {
      reject(e);
    }
  });
}

async function fetchBlob() {
  const response = await fetch('/sig-files/SetcodeMultisigWallet.tvc');
  const blob = await response.blob();
  return blob;
}

async function fetchAbi() {
  const response = await fetch('/sig-files/SetcodeMultisigWallet.abi.json');
  const text = await response.text();
  return JSON.parse(text);
}

async function createWallet() {
  const phrase        = await tonClient.crypto.mnemonic_from_random({words_count: 12, dictionary: 1});
  const keys          = await tonClient.crypto.mnemonic_derive_sign_keys({...phrase, words_count: 12, path: "m/44'/396'/0'/0/0", dictionary: 1});

  const signer = {
    keys,
    type: 'Keys',
  };

  const call_set = {
    function_name: 'constructor',
    header: {
      pubkey: keys.public,
    },
    input: {
      owners: [
        `0x${keys.public}`,
      ],
      reqConfirms: 1,
    },
  };

  const blob = await fetchBlob();
  const tvc  = await blobToBase64(blob);

  const deploy_set = {
    tvc,
  };

  const abiValue = await fetchAbi();

  const abi = {
    value: abiValue,
    type: 'Serialized',
  };

  const payloadEncodeMessage = {
    abi,
    deploy_set,
    call_set,
    signer,
  };

  const wallet = tonClient.abi.encode_message(payloadEncodeMessage);

  return {
    wallet,
    ...phrase,
  };
}

export default createWallet;

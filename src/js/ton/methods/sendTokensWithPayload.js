/**
  * @param {String} wallet from address
  * @param {String} wallet to address
  * @param {Number} amount in tons
  * @param {String} comment for transaction
  * @param {Boolean} force transaction, if receiver doesn't deployed yet
  * @param {String} name of the contract defined in conf.contracts
  * @param {String} ?
  * @param {Object} ?
  */

// abiJSON (Object)
// functionName  (String)
// parametersJSON (Object)
async function sendTokensWithPayload(from, to, amount, keys, sendForce = true, _contract = null, abiJSON, functionName, parametersJSON) {
  let payload = '';

  const contract = _contract || conf.contracts[0].file;

  if (functionName !== undefined && functionName != null && parametersJSON !== undefined && parametersJSON != null) {
    const signer = {
      type: 'None',
    };

    payload = (await conf.tonClient.abi.encode_message_body({
      abi: {
        type: 'Serialized',
        value: abiJSON,
      },
      call_set: {
        function_name: functionName,
        input: parametersJSON,
      },
      is_internal: true,
      signer: signer,
    })).body;
  }

  const abiValue = await fetchAbi(contract);

  const submitTransactionParams = {
    dest: to,
    value: amount * 1000000000,
    bounce: !sendForce,
    allBalance: false,
    payload,
  };

  const params = {
    send_events: false,
    message_encode_params: {
      address: from,
      abi: {
        type: 'Serialized',
        value: abiValue,
      },
      call_set: {
        function_name: 'submitTransaction',
        input: submitTransactionParams,
      },

      signer: {
        type: 'Keys',
        keys,
      },
    },
  };

  const transactionInfo = await conf.tonClient.processing.process_message(params);

  return transactionInfo;
}

export default sendTokensWithPayload;

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

// payload  (String)
async function sendTokensWithBase64Payload(from, to, amount, keys, sendForce = true, _contract = null, payload) {
  let payload = '';

  const contract = _contract || conf.contracts[0].file;

  const abiValue = await fetchAbi(contract);

  const submitTransactionParams = {
    dest: to,
    value: amount * 1000000000,
    bounce: !sendForce,
    allBalance: false,
    payload: payload,
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

export default sendTokensWithBase64Payload;

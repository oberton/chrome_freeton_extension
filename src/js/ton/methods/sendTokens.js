import hex from 'js/utils/utils/hex';
import fetchAbi from './fetchAbi';

const transferAbi = {
  "ABI version": 2,
  functions: [{
    id: "0x00000000",
    name: "transfer",
    inputs: [{
      name:"comment",
      type:"bytes",
    }],
    outputs: [],
  }],
  events: [],
  data: [],
};

// amount - размерность в TON
async function sendTokens(from, to, amount, keys, abiWalletDir, sendForce=true, comment = null) {

  let payload = '';

  if (comment !== undefined || comment != null) {
    const signer = {
      type: 'None',
    };

    payload = (await conf.tonClient.abi.encode_message_body({
      abi: {
        type: 'Serialized',
        value: transferAbi,
      },
      call_set: {
        function_name: "transfer",
        input: {
          comment: hex.encode(comment || ''),
        },
      },
      is_internal: true,
      signer: signer,
    })).body;
  }

  const abiValue = await fetchAbi(abiWalletDir);

  const submitTransactionParams = {
    dest: to,
    value: amount * 1000000000,
    bounce: true,
    allBalance: !sendForce,
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

export default sendTokens;

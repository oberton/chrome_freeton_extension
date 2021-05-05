import fetchAbi from './fetchAbi';

export default async function confirmTransaction(walletAddr, transactionId, contract, custodianKeys) {

  if (transactionId === undefined || transactionId === null || transactionId.length === 0) {
    return false;
  }

  const abiValue = await fetchAbi(contract);

  const params = {
    send_events: false,
    message_encode_params: {
      address: walletAddr,
      abi: {
        type: 'Serialized',
        value: abiValue,
      },
      call_set: {
        function_name: 'confirmTransaction',
        input: {
          transactionId,
        },
      },
      signer: {
        type: 'Keys',
        keys: custodianKeys,
      },
    },
  };

  const result = await conf.tonClient.processing.process_message(params);

  return result;
}

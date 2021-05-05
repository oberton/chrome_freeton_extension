import fetchAbi from './fetchAbi';

export default async function getTransactionInfo(address, contract, transactionId) {

  const account = await conf.tonClient.net.query_collection({
    collection: 'accounts',
    filter: { id: { eq: address } },
    result: 'boc',
  });

  const abiValue = await fetchAbi(contract);

  const messageEncodeParams = {
    address,
    abi: {
      type: 'Serialized',
      value: abiValue,
    },
    call_set: {
      function_name: 'getTransaction',
      input: {
        transactionId: transactionId,
      },
    },
    signer: {
      type: 'None',
    },
  };

  const encodedMessage = await conf.tonClient.abi.encode_message(messageEncodeParams);

  const response = await conf.tonClient.tvm.run_tvm({
    message: encodedMessage.message,
    account: account.result[0].boc,
    abi: {
      type: 'Serialized',
      value: abiValue,
    },
  });

  return response.decoded.output;
}

import fetchAbi from './fetchAbi';

// есть ли транзакции для подтверждения другими кастодианами у кошелька
export default async function getTransactionIds(address, _contract) {

  const account = await conf.tonClient.net.query_collection({
    collection: 'accounts',
    filter: { id: { eq: address } },
    result: 'boc',
  });

  const contract = _contract || conf.contracts[0].file;

  const abiValue = await fetchAbi(contract);

  const messageEncodeParams = {
    address: address,
    abi: {
      type: 'Serialized',
      value: abiValue,
    },
    call_set: {
      function_name: 'getTransactionIds',
      input: {},
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

  return response.decoded.output.ids;
}

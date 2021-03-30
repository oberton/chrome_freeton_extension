async function getAccountType(address) {
  const account = await conf.tonClient.net.query_collection({
    collection: 'accounts',
    filter: { id: { eq: address } },
    result: 'acc_type_name',
  });

  return _.get(account, 'result.0.acc_type_name');
}

export default getAccountType;

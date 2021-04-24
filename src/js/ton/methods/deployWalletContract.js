import fetchAbi from './fetchAbi';
import fetchTvc from './fetchTvc';

// amount - размерность в TON
async function deployWalletContract(keys, contract, owners, expectedAddress = null, reqConfirms = 1) {
  const client = conf.tonClient;

  // Account is active when contract is deployed.
  const ACCOUNT_TYPE_ACTIVE = 1;

  // Account is uninitialized when contract is not deployed yet.
  const ACCOUNT_TYPE_UNINITIALIZED = 0;

  // Number of tokens required to deploy the contract.
  const CONTRACT_REQUIRED_DEPLOY_TOKENS = 500_000_000;

  const abiValue = await fetchAbi(contract);
  const tvcValue = await fetchTvc(contract);

  const { address } = await client.abi.encode_message({
    abi: {
        type: 'Contract',
        value: abiValue
    },
    deploy_set: {
        tvc: tvcValue,
        initial_data: {}
    },
    call_set: {
        function_name: 'constructor',
        input: {
            owners: owners,
            reqConfirms: reqConfirms
        }
    },
    signer: {
        type: 'Keys',
        keys: keys
    },
    processing_try_index: 1
  });

  if (expectedAddress != null && expectedAddress != address) {
    throw new Error(`Expected Address: ${expectedAddress} but get ${address}`)
  }

  const { result } = await client.net.query_collection({
    collection: 'accounts',
    filter: {
      id: {
        eq: address
      }
    },
    result: 'acc_type balance code'
  });

  if (result.length === 0) {
    const mess = `You need to transfer at least 0.5 tokens for deploy to ${address} to your ${client.config.network.server_address}`
    console.log(mess);
    throw new Error(mess)
  }

  if (result[0].acc_type == ACCOUNT_TYPE_ACTIVE) {
    const mess = `Contract is already deployed to ${address}`
    console.log(mess);
    throw new Error(mess)
  }

  // Balance is stored as HEX so we need to convert it.
  if (result[0].acc_type == ACCOUNT_TYPE_UNINITIALIZED && BigInt(result[0].balance) < BigInt(CONTRACT_REQUIRED_DEPLOY_TOKENS)) {
    const mess = `Balance of ${address} is too low for deploy to ${client.config.network.server_address}`
    console.log(mess);
    throw new Error(mess)
  }

  const response = await client.processing.process_message({
    send_events: false,
    message_encode_params: {
      abi: {
        type: 'Contract',
        value: abiValue
      },
      deploy_set: {
        tvc: tvcValue,
        initial_data: {}
      },
      call_set: {
        function_name: 'constructor',
        input: {
          owners: owners,
          reqConfirms: reqConfirms
        }
      },
      signer: {
          type: 'Keys',
          keys: keys
      },
      processing_try_index: 1
    }
  });
  console.log(`Transaction id is ${response.transaction.id}`);
  console.log(`Deploy fees are  ${JSON.stringify(response.fees, null, 2)}`);
  console.log(`Contract is successfully deployed. You can play with your multisig wallet now at ${address}`);

  return response;
}

export default deployWalletContract;

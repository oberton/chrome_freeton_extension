async function fetchAbi(address = '/sig-files/SetcodeMultisigWallet.abi.json') {
  const response = await fetch(address);
  const text = await response.text();
  return JSON.parse(text);
}

export default fetchAbi;

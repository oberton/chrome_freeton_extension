async function fetchAbi(contract) {
  const sigFile = contract || `/sig-files/${conf.contracts[0].file}.abi.json`;
  const response = await fetch(sigFile);
  const text = await response.text();
  return JSON.parse(text);
}

export default fetchAbi;

async function fetchAbi(contract) {
  const sigFile = `/sig-files/${contract || conf.contracts[0].file}.abi.json`;
  const response = await fetch(sigFile);
  const text = await response.text();
  return JSON.parse(text);
}

export default fetchAbi;

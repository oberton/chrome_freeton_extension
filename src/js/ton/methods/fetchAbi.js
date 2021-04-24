async function fetchAbi(_contract) {
  const contract = _contract || conf.contracts[0].file;
  const sigFile = `/sig-files/${contract}.abi.json`;
  const response = await fetch(sigFile);
  const text = await response.text();
  return JSON.parse(text);
}

export default fetchAbi;

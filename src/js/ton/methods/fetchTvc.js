function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new window.FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    } catch(e) {
      reject(e);
    }
  });
}

async function fetchBlob(tvcDir) {
  const response = await fetch(tvcDir);
  const blob = await response.blob();
  return blob;
}

async function fetchTvc(tvcDir = '/sig-files/SetcodeMultisigWallet2.tvc') {
  const blob = await fetchBlob(tvcDir);
  const tvc  = await blobToBase64(blob);
  return tvc;
}

export default fetchTvc;

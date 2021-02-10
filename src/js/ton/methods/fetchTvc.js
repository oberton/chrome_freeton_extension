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

async function fetchBlob() {
  const response = await fetch('/sig-files/SetcodeMultisigWallet2.tvc');
  const blob = await response.blob();
  return blob;
}

async function fetchTvc() {
  const blob = await fetchBlob();
  const tvc  = await blobToBase64(blob);
  return tvc;
}

export default fetchTvc;

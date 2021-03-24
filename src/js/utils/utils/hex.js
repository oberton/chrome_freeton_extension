function encode(str = '') {
  let hex;
  let result = "";

  for (let i = 0; i < str.length; i += 1) {
    hex = str.charCodeAt(i).toString(16);
    result += (`000${hex}`).slice(-4);
  }

  return result;
}

function decode(str) {
  const hexes = str.match(/.{1,4}/g) || [];
  let back = "";

  for(let i = 0; i < hexes.length; i += 1) {
    back += String.fromCharCode(parseInt(hexes[i], 16));
  }

  return back;
}

export default {
  encode,
  decode,
};

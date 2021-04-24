import toHex from 'to-hex';

function encode(str) {
  return toHex(str, {autoDetectString: false});
}

export default {
  encode,
};

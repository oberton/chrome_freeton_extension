function stringToHex (str) {
  let hash  = 0;
  let color = '#';

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  for (let i = 0; i < 3; i++) {
    color += ('00' + (hash >> i * 8 & 0xFF).toString(16)).slice(-2);
  }

  return color;
}

export default stringToHex;

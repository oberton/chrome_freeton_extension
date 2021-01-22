const req = require.context('./utils', true, /\.js$/);

const utils = {};

req.keys().forEach((key) => {
  utils[key.replace(/^[^\w]+(\w+)[^\w]+.+$/, "$1")] = req(key).default;
});

export default utils;

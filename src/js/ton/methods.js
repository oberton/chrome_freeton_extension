const req = require.context('./methods', true, /\.js$/);

const methods = {};

req.keys().forEach((key) => {
  methods[key.replace(/^[^\w]+(\w+)[^\w]+.+$/, "$1")] = req(key).default;
});

export default methods;

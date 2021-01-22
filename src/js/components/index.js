const req = require.context('./', true, /\.cmp\.js$/);

const components = {};

req.keys().forEach((key) => {
  const cmpName = key.match(/^.+\/([^\/\.]+).*$/)[1];
  components[cmpName] = req(key).default;
});

export default components;

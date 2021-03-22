const req = require.context('./', true, /\.dir\.js$/);

req.keys().forEach((key) => {
  const dirName = _.last(key.split('/')).split('.')[0];
  window[dirName] = req(key).default;
});

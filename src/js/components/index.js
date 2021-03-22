const req = require.context('./', true, /\.svelte$/);

req.keys().forEach((key) => {
  const cmpName = _.last(key.split('/')).split('.')[0];
  window[cmpName] = req(key).default;
});

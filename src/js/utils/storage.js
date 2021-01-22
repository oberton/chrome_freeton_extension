// rely on window.localStorage in developent mode if chrome not available

export function get(_objKeys, callback) {

  if (_.get(chrome, 'storage.local')) {
    chrome.storage.local.get(_objKeys, callback);
    return;
  }

  if (NODE_ENV === 'production') {
    throw new Error('Storage is not defined');
  }

  const objKeys = _.flatten(_objKeys);
  const result = {};
  _.each(objKeys, key => {
    result[key] = window.localStorage.getItem(key);
  });

  callback(result);
}

export function set(obj, callback) {
  const [key, val] = _.toPairs(obj)[0];

  if (_.get(chrome, 'storage.local')) {
    chrome.storage.local.set(obj, callback);
    return;
  }
  if (NODE_ENV === 'production') {
    throw new Error('Storage is not defined');
  }
  window.localStorage.setItem(key, val);
  callback();
}

export function remove(_objKeys, callback) {
  if (_.get(chrome, 'storage.local')) {
    chrome.storage.local.remove(_objKeys, callback);
    return;
  }

  if (NODE_ENV === 'production') {
    throw new Error('Storage is not defined');
  }

  const objKeys = _.flatten(_objKeys);

  _.each(objKeys, key => {
    window.localStorage.removeItem(key);
  });

  callback();
}

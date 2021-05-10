// rely on window.localStorage in developent mode if chrome not available
import safeJSONParse from './safeJSONParse';
import crypto from './crypto';
import tmpId from './tmpId';

function get(_objKeys) {
  return new Promise((resolve, reject) => {
    try {
      if (_.get(chrome, 'storage.local')) {
        chrome.storage.local.get(_objKeys, resolve);
        return;
      }

      if (NODE_ENV === 'production') {
        reject(new Error('Storage is not defined'));
        return;
      }

      const objKeys = _.flatten([_objKeys]);

      const result = {};
      _.each(objKeys, key => {
        result[key] = window.localStorage.getItem(key);
      });

      resolve(result);
    } catch(e) {
      reject(e);
    }
  });
}

function set(obj) {
  return new Promise((resolve, reject) => {
    try {
      const [key, val] = _.toPairs(obj)[0];

      if (_.get(chrome, 'storage.local')) {
        chrome.storage.local.set(obj, resolve);
        return;
      }
      if (NODE_ENV === 'production') {
        reject(new Error('Storage is not defined'));
        return;
      }
      window.localStorage.setItem(key, val);
      resolve();
    } catch(e) {
      reject(e);
    }
  });
}

function remove(_objKeys) {
  return new Promise((resolve, reject) => {
    try {
      if (_.get(chrome, 'storage.local')) {
        chrome.storage.local.remove(_objKeys, resolve);
        return;
      }

      if (NODE_ENV === 'production') {
        reject(new Error('Storage is not defined'));
        return;
      }

      const objKeys = _.flatten([_objKeys]);

      _.each(objKeys, key => {
        window.localStorage.removeItem(key);
      });

      resolve();
    } catch(e) {
      reject(e);
    }
  });
}

function getArrayValue(key, pin = conf.myPin) {
  return new Promise((resolve, reject) => {
    get(key).then(objValue => {
      let strValue = _.get(objValue, key);

      if (!strValue) {
        resolve(undefined);
        return;
      }

      if (pin) {
        strValue = crypto.decrypt(strValue, pin);

        if (!strValue) {
          resolve(undefined);
          return;
        }
      }

      let arrValue = safeJSONParse(strValue);

      if (!_.isArray(arrValue)) {
        arrValue = [];
      }

      resolve(arrValue);
    }).catch(reject);
  });
}

function setEncrypted(key, _value, pin = conf.myPin) {
  return new Promise((resolve, reject) => {
    const value = _.isObject(_value) || _.isArray(_value) ? JSON.stringify(_value) : _value;

    const setValue = pin ? crypto.encrypt(value, pin) : value;
    set({[key]: setValue}).then(() => {
      resolve(value);
    }).catch(reject);
  });
}

function push(key, value, pin = conf.myPin) {
  return new Promise((resolve, reject) => {
    getArrayValue(key, pin).then(arrValue => {
      if (!arrValue) {
        arrValue = [];
      }
      if (_.isObject(value) && !_.isArray(value)) {
        value.tmpId = tmpId();
      }
      arrValue.push(value);
      setEncrypted(key, arrValue, pin).then(resolve).catch(reject);
    }).catch(reject);
  });
}

function splice(key, index, count, pin = conf.myPin) {
  return new Promise((resolve, reject) => {
    getArrayValue(key, pin).then(arrValue => {
      if (!arrValue) {
        resolve(undefined);
        return;
      }
      arrValue.splice(index, count);
      let strValue = JSON.stringify(arrValue);
      if (pin) {
        strValue = crypto.encrypt(strValue, pin);
      }
      set({[key]: strValue}).then(() => {
        resolve(arrValue);
      });
    }).catch(reject);
  });
}

async function assign(key, id, params = {}, pin = conf.myPin) {
  const value = await getArrayValue(key, pin);
  const item = _.find(value, i => i.tmpId === id);

  if (!item) {
    return;
  }
  _.assign(item, params);

  let strValue = JSON.stringify(value);
  if (pin) {
    strValue = crypto.encrypt(strValue, pin);
  }
  await set({[key]: strValue});
}

export default {
  get,
  set,
  remove,
  getArrayValue,
  setEncrypted,
  push,
  splice,
  assign,
};

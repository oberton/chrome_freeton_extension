// rely on window.localStorage in developent mode if chrome not available
import safeJSONParse from './safeJSONParse';
import crypto from './crypto';

function get(_objKeys) {
  return new Promise((resolve, reject) => {
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
  });
}

function set(obj) {
  return new Promise((resolve, reject) => {
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
  });
}

function remove(_objKeys) {
  return new Promise((resolve, reject) => {
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

  });
}

function getArrayValue(key, pin) {
  return new Promise(resolve => {
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
    });
  });
}

function push(key, value, pin) {
  return new Promise(resolve => {
    getArrayValue(key, pin).then(arrValue => {
      if (!arrValue) {
        arrValue = [];
      }
      arrValue.push(value);
      let strValue = JSON.stringify(arrValue);
      if (pin) {
        strValue = crypto.encrypt(strValue, pin);
      }
      set({[key]: strValue}).then(() => {
        resolve(arrValue);
      });

    });
  });
}

function splice(key, index, count, pin) {
  return new Promise(resolve => {
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
    });
  });
}

export default {
  get,
  set,
  remove,
  getArrayValue,
  push,
  splice,
};

let localeHash = {};

export function t(key, data = {}) {
  let value = _.get(localeHash, key, key);
  if (value && !_.isEmpty(data)) {
    value = _.template(value)(data);
  }
  return value;
}

export function init(hash) {
  localeHash = hash;
}

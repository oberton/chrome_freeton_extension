let localeHash = {};

export function t(key, raw = false) {
  const value = _.get(localeHash, key, key);
  if (!_.isString(value) && !raw) {
    return JSON.stringify(value);
  }
  return value;
}

export function init(hash) {
  localeHash = hash;
}

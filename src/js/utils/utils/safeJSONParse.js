function safeJSONParse(str, defaultObj = {}) {
  let res = defaultObj;
  try {
    res = JSON.parse(str);
    res = _.isObject(res) ? res : defaultObj;
  } catch (e) {
    return defaultObj;
  }
  return res;
}

export default safeJSONParse;

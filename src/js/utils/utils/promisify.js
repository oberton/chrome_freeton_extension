export default function promisify(fn) {
  return (...fnParams) => new Promise((resolve, reject) => {
    fn(...fnParams, (err, ...params) => {
      if (err) {
        return reject(err);
      }
      return resolve(...params);
    });
  });
}

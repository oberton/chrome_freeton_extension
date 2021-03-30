const toFn = (promise) => promise.then(data => [null, data]).catch(err => [err]);

export default toFn;

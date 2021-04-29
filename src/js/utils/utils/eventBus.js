const events = {};
window.eee = events;

function on(eventName, cb) {
  if (!events[eventName]) {
    events[eventName] = [];
  }
  events[eventName].push(cb);
}

function trigger(eventName, value) {
  _.each(events[eventName], cb => {
    cb(value);
  });
}

function off(eventName, fn) {
  _.each(events[eventName], (cb, i) => {
    if (cb === fn) {
      events[eventName].splice(i, 1);
    }
    if (_.isEmpty(events[eventName])) {
      delete events[eventName];
    }
  });
}

export default { on, trigger, off };

function on(name, cb) {
  document.addEventListener(name, cb);
}

function off(name, cb) {
  document.removeEventListener(name, cb);
}

function emit(name, detail) {
  document.dispatchEvent(new window.CustomEvent(name, {detail}));
}

export {
  on,
  off,
  emit,
};

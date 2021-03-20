function removeToast(toast) {
  toast.remove();
}
window._removeToast = (e) => removeToast(e.target.closest('.toast'));

function getContainer() {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.classList.add('toast-container');
    document.body.appendChild(container);
  }
  return container;
}

function show(type, msg, opts = {}) {
  const container = getContainer();
  const toast = document.createElement('div');
  toast.classList.add('toast', `toast-${type}`);
  toast.innerHTML = `<div class='tbl'>
    <div class='tbl-cell alg-m'>
      ${msg}
    </div>
    <div class='tbl-cell alg-m text-right'>
      <span class='text-lg smile' style='cursor: pointer;' onclick='_removeToast(event)'>&times;</span>
    </div>
  </div>`;

  container.appendChild(toast);

  setTimeout(() => {
    removeToast(toast);
  }, opts.time || 1500);
}

const toasts = _([
  'error',
  'info',
]).map(key => [key, (...params) => show(key, ...params)]).fromPairs().value();

export default {...toasts, show };

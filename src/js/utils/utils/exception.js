import toast from './toast';

function exception(err) {
  if (err && err.code === 603) {
    // ignore waitFor timeout error
    return;
  }
  const message = err.message || err.toString();
  toast.error(message, {time: 10000});
}

export default exception;

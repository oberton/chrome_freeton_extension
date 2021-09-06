export default function (node) {

  const minWidth = (node.getAttribute('placeholder') || '').length * 7 || 40;

  function setWidth() {
    const maxWidth = node.parentElement.offsetWidth;
    const value = node.value || '';

    const width = _.min([
      _.max([value.length * 7, minWidth]),
      maxWidth || minWidth,
    ]);

    node.style.width = `${width}px`;
  }

  node.addEventListener('input', setWidth);

  setTimeout(setWidth);

  return {
    destroy() {
      node.removeEventListener('input', setWidth);
    },
  };

}

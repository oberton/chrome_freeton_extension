export default function draggable(dragEl) {

  dragEl.draggable = true;
  dragEl.classList.add('c-sortable');

  const rootEl = dragEl.closest('.c-draggable-root');

  const getMouseOffset = (e) => {
    const targetRect = e.target.getBoundingClientRect();
    const offset = {
      x: e.pageX - targetRect.left,
      y: e.pageY - targetRect.top,
    };
    return offset;
  };

  const getElementVerticalCenter = (el) => {
    const rect = el.getBoundingClientRect();
    return (rect.bottom - rect.top) / 2;
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const target = e.target.closest('.c-sortable');

    if (target && target !== dragEl && target.nodeName === 'DIV') {

      const offset = getMouseOffset(e);
      const middleY = getElementVerticalCenter(e.target);

      if (offset.y > middleY) {
        rootEl.insertBefore(dragEl, target.nextSibling);
      } else {
        rootEl.insertBefore(dragEl, target);
      }
    }
  };

  const onDragEnd = (e) => {
    e.preventDefault();
    dragEl.classList.remove('ghost');
    rootEl.removeEventListener('dragover', onDragOver, false);
    rootEl.removeEventListener('dragend', onDragEnd, false);

    const items = _.map(rootEl.querySelectorAll('.c-sortable'), item => item.getAttribute('data-id'));

    rootEl.dispatchEvent(new window.CustomEvent('sort', {detail: items}));
  };

  const onDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('Text', dragEl.textContent);

    rootEl.addEventListener('dragover', onDragOver, false);
    rootEl.addEventListener('dragend', onDragEnd, false);

    setTimeout(() => {
      dragEl.classList.add('ghost');
    });
  };

  dragEl.addEventListener('dragstart', onDragStart, false);

  return {
    destroy() {
      dragEl.removeEventListener('dragstart', onDragStart, false);
    },
  };
}

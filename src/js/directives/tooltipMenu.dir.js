import { createPopper } from '@popperjs/core';

function tooltipMenu(node) {
  let shown = false;
  let popper;

  const parentElement = node.parentElement;

  const tooltip = parentElement.querySelector('.tooltip-menu');
  parentElement.removeChild(tooltip);

  const placement = node.getAttribute('placement') || 'bottom-end';

  tooltip.style.display = 'none';

  const onDocumentClick = (e) => {
    if (e.target.closest('[close-tooltip]')) {
      hide();
      return;
    }
    if (tooltip.contains(e.target) || node.contains(e.target)) {
      return;
    }
    hide();
  };

  const show = () => {
    document.body.appendChild(tooltip);
    tooltip.style.display = 'block';

    popper = createPopper(node, tooltip, {
      placement,
    });

    document.addEventListener('click', onDocumentClick);

    shown = true;
  };

  const hide = () => {
    document.body.removeChild(tooltip);
    popper.destroy();
    tooltip.style.display = 'none';
    document.removeEventListener('click', onDocumentClick);
    shown = false;
  };

  const onClick = () => {
    if (shown) {
      hide();
    } else {
      show();
    }
  };

  node.addEventListener('click', onClick);

  return {
    destroy() {
      node.removeEventListener('click', onClick);
    },
  };
}

export default tooltipMenu;

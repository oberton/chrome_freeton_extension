import { createPopper } from '@popperjs/core';

function tooltip(node) {

  let activeTooltip;

  const hideAll = () => {
    clearTimeout(node.__showTooltipTimeout);

    document.querySelectorAll('.tooltip').forEach(tt => {
      tt.__popperInstance.destroy();
      tt.remove();
      clearInterval(tt.__contentInterval);
    });
  };

  const show = (_text) => {
    clearTimeout(node.__showTooltipTimeout);

    node.__showTooltipTimeout = setTimeout(() => {
      let text = _text;
      hideAll();
      activeTooltip = document.createElement('div');
      activeTooltip.classList.add('tooltip');

      const tooltipClass = _.get(node, 'attributes.data-tooltip-class.value');

      if (tooltipClass) {
        activeTooltip.classList.add(tooltipClass);
      }

      activeTooltip.innerText = text;
      document.body.appendChild(activeTooltip);
      activeTooltip.__popperInstance = createPopper(node, activeTooltip, {
        placement: 'auto',
        modifiers: [{
          name: 'preventOverflow',
          options: {
            boundary: document.getElementById('app'),
          },
        }],
      });

      activeTooltip.__contentInterval = setInterval(() => {
        const newText = _.get(node, 'attributes.data-tooltip.value');
        if (newText !== text) {
          activeTooltip.innerText = newText;
          text = newText;
        }
      }, 250);
      setTimeout(() => {
        if (activeTooltip) {
          activeTooltip.classList.add('shown');
        }
      });
    }, 100);
  };

  const onHover = () => {
    clearTimeout(node.__showTooltipTimeout);

    hideAll();
    const text = _.get(node, 'attributes.data-tooltip.value');
    if (!text) {
      return;
    }
    show(text);
  };

  node.addEventListener('mouseenter', onHover);
  node.addEventListener('mouseleave', hideAll);

  return {
    destroy() {
      if (activeTooltip) {
        if (activeTooltip.__popperInstance) {
          activeTooltip.__popperInstance.destroy();
        }
        activeTooltip.remove();
      }
      node.removeEventListener('mouseenter', onHover);
      node.removeEventListener('mouseleave', hideAll);
    },
  };
}

export default tooltip;

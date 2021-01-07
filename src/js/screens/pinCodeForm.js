const keyboard = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
].map(row => `<div class='pin-row'>${row.map(i => `<div class='pin-btn' action='${i}'>${i}</div>`).join('')}</div>`).join('');

const template = `
<div>
  <div class='text-md gtr-b'>Enter Pin</div>
  <div class='pin-dots'>
    <div class='pin-dots-item'></div>
    <div class='pin-dots-item'></div>
    <div class='pin-dots-item'></div>
    <div class='pin-dots-item'></div>
    <div class='pin-dots-item'></div>
    <div class='pin-dots-item'></div>
  </div>
  <div class='pin-container'>
    ${keyboard}
    <div class='pin-row'>
      <div class='pin-btn empty'></div>
      <div class='pin-btn' action='0'>0</div>
      <div class='pin-btn' action='-1'>
        <span class='text-xs'>&#9003;</span>
      </div>
    </div>
  </div>
</div>

`;

let component;

const pin = [];

function onPinContainerClick(e) {
  const btn = e.target.closest('.pin-btn[action]');
  if (!btn) {
    return;
  }
  const action = parseInt(btn.getAttribute('action'), 10);
  if (action === -1) {
    pin.pop();
  } else {
    pin.push(action);
  }
}

function render(app) {
  component = document.createElement('div');
  component.innerHTML = template;
  app.appendChild(component);

  const pinContainer = component.querySelector('.pin-container');
  pinContainer.addEventListener('click', onPinContainerClick);

  return {
    destroy() {
      pinContainer.removeEventListener('click', onPinContainerClick);

      component.remove();
      component = null;
    },
  };

}

export default render;

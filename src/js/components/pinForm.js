import createComponent from '../utils/createComponent';

const keyboard = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
].map(row => `<div class='pin-row'>${row.map(i => `<div class='pin-btn' action='${i}'>${i}</div>`).join('')}</div>`).join('');

const template = `
<div class='pin-form'>
  <div class='text-md gtr-b' id='pin-title'>
    <span class="color-blue head-xs" id='pin-back' style="
      display: none;
      cursor: pointer;
      height: 0.5em;
      width: 1em;
      vertical-align: middle;
      line-height: 0;
      margin-left: -0.2em;">
      &#8592;
    </span>
    <span bind='title'></span>
  </div>
  <div class='pin-dots gtr-ver'>
    <div class='pin-dots-item'></div>
    <div class='pin-dots-item'></div>
    <div class='pin-dots-item'></div>
    <div class='pin-dots-item'></div>
    <div class='pin-dots-item'></div>
    <div class='pin-dots-item'></div>
  </div>
  <div class="color-light text-xs gtr-ver" bind='placeholder'></div>
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

let pin = [];

function renderDots(dots) {
  for (let i = 0; i < dots.length; i += 1) {
    dots[i].classList[typeof pin[i] !== 'undefined' ? 'add' : 'remove']('active');
  }
}

function onError() {
  const dotsItems = this.element.getElementsByClassName('pin-dots-item');
  this.element.classList.add('pin-error');
  pin = [];
  setTimeout(() => {
    this.element.classList.remove('pin-error');
    renderDots(dotsItems);
  }, 300);
}

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
  const dotsItems = this.element.getElementsByClassName('pin-dots-item');
  renderDots(dotsItems);
  if (pin.length === 6) {
    const pinString = pin.join('');
    if (this.params.prevPin && this.params.prevPin !== pinString) {
      this.onError();
      return;
    }
    this.callbacks.onSubmit(pinString);
  }
}

function render(app, params, callbacks) {
  const $cmp = createComponent(app, params, callbacks, template, {
    onPinContainerClick,
    onError,
  });

  pin = [];

  let goBackBtn;

  if ($cmp.params.prevPin) {
    goBackBtn = $cmp.element.querySelector('#pin-back');
    goBackBtn.style.display = 'inline-block';
    goBackBtn.addEventListener('click', $cmp.callbacks.goBack);
  }

  $cmp.pinContainer = $cmp.element.querySelector('.pin-container');
  $cmp.pinContainer.addEventListener('click', $cmp.onPinContainerClick);

  $cmp.onDestroy = () => {
    $cmp.pinContainer.removeEventListener('click', $cmp.onPinContainerClick);

    if (goBackBtn) {
      goBackBtn.removeEventListener('click', $cmp.callbacks.goBack);
    }
  };

  return $cmp;
}

export default render;

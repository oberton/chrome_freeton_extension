import * as eventBus from '../utils/eventBus';

const wordsDefaultPlaceholder = '11 or 24 words';

const template = `
  <form id='phrase-form'>
    <div class='phrase-form-container'>
      <div class='text-md gtr-b-2x'>Restore Surf</div>
      <div class='color-dim gtr-b'>Sign In with password backup.</div>
      <textarea rows='1' autofocus placeholder='Master Password' class='form-control' required id='phrase-area'></textarea>
      <div id='words-placeholder' class='text-xs gtr-b color-light'>${wordsDefaultPlaceholder}</div>
    </div>
    <button class='btn-blue font-bold full-width text-md' type='submit'>Sign In</button>
  </form>
`;

let component;

function getWordsCount(value) {
  return value.split(' ').filter(v => v).length;
}

function getWordsPlaceholder(value) {
  const wordsCount = getWordsCount(value);
  if (!wordsCount) {
    return wordsDefaultPlaceholder;
  }
  if (wordsCount === 1) {
    return `1 word`;
  }
  return `${wordsCount} words`;
}

function submitValue(value) {
  if (!value) {
    return;
  }
  const wordsCount = getWordsCount(value);
  if (wordsCount === 11 || wordsCount === 24) {
    eventBus.emit('form-submit', value);
  }
  eventBus.emit('form-submit', value);
}

function onTextareaInput(e) {
  const target = e.target;
  const wordsPlaceholder = document.getElementById('words-placeholder');
  const value = target.value.trim();

  wordsPlaceholder.innerText = getWordsPlaceholder(value);

  if (e.which === 32) {
    if (target.value[e.target.selectionEnd] === ' ' || target.value[e.target.selectionEnd - 1] === ' ') {
      e.preventDefault();
      return;
    }
  }

  if (e.which === 13) {
    e.preventDefault();
    submitValue(value);
    return;
  }

  const styles = window.getComputedStyle(e.target);
  const paddings = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
  e.target.style.height = 'auto';
  e.target.style.height =  `${e.target.scrollHeight - paddings}px`;
}

function onFormSubmit(e) {
  e.preventDefault();
  const value = e.target.querySelector('#phrase-area').value;
  submitValue(value);
}

function render(app) {
  component = document.createElement('div');
  component.innerHTML = template;

  app.appendChild(component);

  const textarea = app.querySelector('#phrase-area');
  textarea.addEventListener('keypress', onTextareaInput);
  textarea.addEventListener('keyup', onTextareaInput);

  const form = app.querySelector('#phrase-form');
  form.addEventListener('submit', onFormSubmit);

  return {
    destroy() {
      textarea.removeEventListener('keypress', onTextareaInput);
      textarea.removeEventListener('keyup', onTextareaInput);
      form.removeEventListener('submit', onFormSubmit);

      component.remove();
      component = null;
    },
  };
}

export default render;

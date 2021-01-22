const wordsDefaultPlaceholder = '11 or 24 words';

const template = `
  <form id='phrase-form' class='fadeIn'>
    <div class='phrase-form-container'>
      <div class='text-md gtr-b-2x'>Restore Surf</div>
      <div class='color-dim gtr-b'>Sign In with password backup.</div>
      <label id='area-label'>
        <textarea rows='1' autofocus placeholder='Master Password' class='form-control' required id='phrase-area'></textarea>
      </label>
      <div id='words-placeholder' class='text-xs gtr-b color-light'>${wordsDefaultPlaceholder}</div>
    </div>
    <button class='btn-blue font-bold full-width text-md' type='submit'>Sign In</button>
    <div class='text-center gtr-b-xs gtr-t-sm text-sm color-light'>or</div>
    <button c-click='createWallet' class='btn-blue-light font-bold full-width' type='button'>Create Wallet</button>
  </form>
`;

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
  const wordsCount = getWordsCount(value);
  // check 11 or 24 words
  // validate passphrase
  if (wordsCount === 11 || wordsCount === 24) {
    console.log('!cool!');
  }
  this.callbacks.onSubmit(value);
}

function createWallet() {
  this.callbacks.onCreateWallet();
}

function onTextareaInput(e) {
  const target = e.target;
  const wordsPlaceholder = this.element.querySelector('#words-placeholder');
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
    this.submitValue(value);
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
  if (!value) {
    return;
  }
  this.submitValue(value);
}

function render(app, params, callbacks) {

  const $cmp = utils.createComponent(app, params, callbacks, template, {
    onTextareaInput,
    onFormSubmit,
    submitValue,
    createWallet,
  });

  $cmp.textarea = $cmp.element.querySelector('#phrase-area');
  $cmp.textarea.addEventListener('keypress', $cmp.onTextareaInput);
  $cmp.textarea.addEventListener('keyup', $cmp.onTextareaInput);

  $cmp.form = app.querySelector('#phrase-form');
  $cmp.form.addEventListener('submit', $cmp.onFormSubmit);

  setTimeout(() => {
    $cmp.textarea.focus();
    $cmp.textarea.setSelectionRange(0, 0);
  });

  $cmp.onDestroy(() => {
    $cmp.textarea.removeEventListener('keypress', $cmp.onTextareaInput);
    $cmp.textarea.removeEventListener('keyup', $cmp.onTextareaInput);
    $cmp.form.removeEventListener('submit', $cmp.onFormSubmit);
  });

  return $cmp;
}

export default render;

<script>
  import NetworkSwitcher from '../common/NetworkSwitcher.svelte';

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const wordsDefaultPlaceholder = '11 or 24 words';
  let phrase = '';
  let wordsPlaceholder = wordsDefaultPlaceholder;

  function signIn() {
    dispatch('submit', phrase.trim());
  }

  async function createWallet() {
    const { phrase } = await tonMethods.getWalletData(null, true);
    dispatch('submit', phrase);
  }

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

  function onAreaKeydown(e) {
    const target = e.target;
    wordsPlaceholder = getWordsPlaceholder(phrase.trim());

    if (e.which === 32) {
      if (target.value[e.target.selectionEnd] === ' ' || target.value[e.target.selectionEnd - 1] === ' ') {
        e.preventDefault();
        return;
      }
    }

    if (e.which === 13) {
      e.preventDefault();
      setTimeout(signIn);
      return;
    }

    const styles = window.getComputedStyle(target);
    const paddings = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
    target.style.height = 'auto';
    target.style.height =  `${target.scrollHeight - paddings}px`;
  }
</script>

<div>
  <form id='phrase-form' class='fadeIn' on:submit={signIn}>
    <div class='phrase-form-container'>
      <div class='text-md gtr-b-2x'>Restore Surf</div>
      <div class='text-row font-bold'>
        <NetworkSwitcher />
      </div>
      <div class='color-dim gtr-b'>Sign In with password backup.</div>
      <div class='form-group'>
        <textarea
          rows='1'
          bind:value={phrase}
          on:keydown={onAreaKeydown}
          class={`form-control ${phrase ? "" : "empty"}`}
          required></textarea>
        <label class='form-label'>Master Password</label>
      </div>
      <div id='words-placeholder' class='text-xs gtr-b color-light'>{wordsPlaceholder}</div>
    </div>
    <button class='btn-blue font-bold full-width text-md' type='submit'>Sign In</button>
    <div class='text-center gtr-b-xs gtr-t-sm text-sm color-light'>or</div>
    <button on:click={createWallet} class='btn-blue-light font-bold full-width' type='button'>Create Wallet</button>
  </form>
</div>

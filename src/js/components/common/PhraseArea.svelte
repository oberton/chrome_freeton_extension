<div>
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

<script>
  export let phrase = '';

  const wordsDefaultPlaceholder = '11 or 24 words';

  let wordsPlaceholder = wordsDefaultPlaceholder;

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

    if (e.which === 13) {
      e.preventDefault();
      return;
    }

    if (e.which === 32) {
      if (target.value[e.target.selectionEnd] === ' ' || target.value[e.target.selectionEnd - 1] === ' ') {
        e.preventDefault();
        return;
      }
    }

    setTimeout(() => {
      wordsPlaceholder = getWordsPlaceholder(phrase.trim());

      const styles = window.getComputedStyle(target);
      const paddings = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
      target.style.height = 'auto';
      target.style.height =  `${target.scrollHeight + 2}px`;
    });
  }
</script>

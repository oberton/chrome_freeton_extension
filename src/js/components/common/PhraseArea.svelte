<div>
  <FormTextArea
    required={true}
    bind:value={phrase}
    on:keydown={onAreaKeydown}
    label={t('labels.master_password')} />

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

  function onAreaKeydown() {
    wordsPlaceholder = getWordsPlaceholder(phrase.trim());
  }
</script>

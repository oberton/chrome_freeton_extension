<button
  type='button'
  class='btn-blue-light btn-round'
  with-tooltip={copying ? t('info.copied') : $$props.label}
  on:click={copyValue}>
    <span class='icon-copy text-lg'></span>
</button>

<script>
  let copying = false;

  function copyValue() {
    copying = true;
    utils.copyToClipboard($$props.value);
    setTimeout(() => {
      copying = false;
    }, 200);
  }
</script>

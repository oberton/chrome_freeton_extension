<button
  type='button'
  class='btn-dim-light btn-round'
  use:tooltip
  data-tooltip={copying ? t('info.copied') : $$props.label}
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
    }, 500);
  }
</script>

<span>
  {#if gemPos === 'left'}
    <span class='smile alg-m gtr-r-xs icon-gem color-blue text-xs '></span>
  {/if}
  <span>{parts[0]}.</span><span class='color-light'>{parts[1]}</span>
  {#if gemPos === 'right'}
    <span class='smile alg-m gtr-l-xs text-xs icon-gem color-blue'></span>
  {/if}
</span>

<script>
  export let value = 0;
  export let gemPos = 'left';
  let parts = [];

  svelte.onMount(() => {
    parts = (value / 1_000_000_000).toFixed(3).split('.');
  });
</script>

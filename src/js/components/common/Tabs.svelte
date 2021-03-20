<div class='tabs-container'>
  <div class='tabs'>
    {#each $$props.tabs as t, i }
      <div on:click={() => setTab(t)} class={"tabs-item" + (t === tab ? " active" : "") }>{t}</div>
    {/each}
  </div>
</div>

<script>
  export let tab = '';

  function setTab(t) {
    tab = t;
  }
</script>

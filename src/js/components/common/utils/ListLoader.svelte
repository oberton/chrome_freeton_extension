<div>
  {#each range as tick}
    <div class='gtr-ver-xs'>
      <div class='list-loader pos-rel'>
        <slot></slot>
      </div>
    </div>
  {/each}
</div>

<script>
  export let times = 5;
  let range = [];

  svelte.onMount(() => {
    range = _.range(times);
  });
</script>

<div class='smile cell-12' use:tooltip data-tooltip={(label ? label + ': ' : '') + address} style='font-family: monospace;'>
  {addressToShow}
</div>

<script>
  export let address;
  export let take;
  export let label;

  let addressToShow;

  svelte.onMount(async () => {
    const toTake = take || 13;

    addressToShow = _(address)
      .chunk(Math.ceil(address.length / 2))
      .map((v, i) => (i
        ? _.take(v.reverse(), toTake).reverse()
        : _.take(v, toTake)).join('')
      ).join('...')

  });

</script>

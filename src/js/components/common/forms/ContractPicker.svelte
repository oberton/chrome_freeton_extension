<div>
  <div>
    <div class='smile color-label' style='cursor: pointer' on:click={toggleFlag.showAdvanced}>
      <span class={"smile gtr-r-sm icon-angle-" + ($flag.showAdvanced ? "up" : "down")}></span>
      <span class='smile text-xs' style='text-transform: uppercase;'>
        {$flag.showAdvanced ? t('labels.wallet.contract') : t('labels.advanced')}
      </span>
    </div>
  </div>

  {#if $flag.showAdvanced }
    <div class='form-select form-group nospace'>
      <select name='contract' bind:value={value}>
        {#each contracts as contract}
          <option value={contract.file}>{contract.name}</option>
        {/each}
      </select>
    </div>
  {/if}
</div>

<script>
  export let value;
  const contracts = conf.contracts;

  const { flag, toggleFlag } = utils.initFlags([
    'showAdvanced',
  ]);

</script>

<ModalDialog headline={headline} on:close={() => dispatch('close')}>
  <FormControl
    label={t('labels.multisig.min_confirms')}
    type='number'
    min='1'
    step='1'
    bind:value={formData.minConfirms}
    required={true}>
  </FormControl>

  <div class='gtr-t'>
    <div class='gtr-b-sm color-label' style='font-size: 11px;'>
      {t('labels.custodians.plural')}
    </div>

    {#if formData.custodians && formData.custodians.length}
      <div class='text-line'>
        {#each formData.custodians as custodian}
          <div class='row-l-sm'>
            <CustodianPreviewItem on:remove={() => removeCustodian(custodian)} custodian={custodian}></CustodianPreviewItem>
          </div>
        {/each}
      </div>
    {/if}

    <div class='smile'>
      <button
        class="btn-blue-glass btn-round smile"
        style="font-size: 10px;"
        on:click={updateTooltipKey}
        use:tooltip
        use:tooltipMenu
        placement='right'
        data-tooltip={t("labels.custodians.add")}>
        <span class="icon-add" style="font-size: 1.8em; line-height: 1.75em;"></span>
      </button>

      <div class='tooltip-menu' style='width: calc(100% - 70px); padding: 10px;'>
        {#key tooltipKey}
          <div data-key={tooltipKey}>
            <AddCustodianForm custodians={formData.custodians} on:add={addCustodian}></AddCustodianForm>
          </div>
        {/key}
      </div>
    </div>
  </div>

  <div class='gtr-t'>
    <button class="btn-blue font-bold full-width text-md" on:click={saveContractPrefs}>
      {label}
    </button>
  </div>
</ModalDialog>

<script>
  export let shownDialog;
  export let payload;
  export let label;

  let tooltipKey = 0;

  const dispatch = svelte.createEventDispatcher();

  let headline;
  let formData = {};

  function updateTooltipKey() {
    tooltipKey = +new Date();
  }

  function removeCustodian(custodian) {
    formData.custodians = _.filter(formData.custodians, c => !_.isEqual(c, custodian));
  }

  function addCustodian(e) {
    formData.custodians = [...formData.custodians, e.detail];
  }

  function saveContractPrefs() {
    dispatch('set', formData);
  }

  svelte.onMount(async () => {
    headline = _.find(conf.contracts, c => c.file === payload.contract).name;
    formData = {
      minConfirms: 1,
      custodians: [],
    };
  });

</script>

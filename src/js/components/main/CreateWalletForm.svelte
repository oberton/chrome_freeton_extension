<form on:submit|preventDefault={generateWallet}>
  <div>
    <div class='gtr-b-sm text-xs color-label'>
      {t('labels.wallet.word_count')}
    </div>

    <div class='smile gtr-r'>
      <label class='form-radio'>
        <input type='radio' value='12' checked name='word_count' />
        <span>12</span>
      </label>
    </div>

    <div class='smile gtr-r'>
      <label class='form-radio'>
        <input type='radio' value='24' name='word_count' />
        <span>24</span>
      </label>
    </div>
  </div>

  <div class='gtr-t-2x text-sm font-semi' on:click={toggleAdvanced}>
    <div class='smile' style='cursor: pointer'>
      <span class={"smile gtr-r-sm icon-angle-" + (showAdvanced ? "up" : "down")}></span>
      {t('labels.advanced')}
    </div>
  </div>

  {#if showAdvanced}
    <div class='form-select form-group'>
      <select name='contract'>
        {#each contracts as contract}
          <option value={contract}>{contract}</option>
        {/each}
      </select>
      <label class='form-label'>
        {t('labels.wallet.contract')}
      </label>
    </div>
  {/if}


  <div class='gtr-t-2x'>
    <button class="btn-blue font-bold full-width text-md" type='submit'>
      {t('actions.wallet.create')}
    </button>
  </div>
</form>

<script>
let showAdvanced = false;
const contracts = conf.contracts;
const dispatch = svelte.createEventDispatcher();


function toggleAdvanced() {
  showAdvanced = !showAdvanced;
}

async function generateWallet(e) {
  const params = _.fromPairs(Array.from(new FormData(e.target)));
  const word_count = parseInt(params.word_count || 12, 10);
  const contract = params.contract || conf.contracts[0];

  const { phrase } = await tonMethods.getWalletData(null, true, { word_count }, contract);
  dispatch('walletAdded', phrase);
}

</script>

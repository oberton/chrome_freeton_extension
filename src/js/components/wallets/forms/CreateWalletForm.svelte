<form on:submit|preventDefault={generateWallet}>
  <div class='text-line'>
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

  <ContractPicker bind:value={contract}></ContractPicker>

  <div class='gtr-t-2x'>
    <button class="btn-blue font-bold full-width text-md" type='submit'>
      {t('actions.wallet.create')}
    </button>
  </div>

  {#if $flag.contractPrefsDialog}
    <ContractPrefsDialog
      payload={newWalletPayload}
      label={t('actions.wallet.create')}
      on:set={setContractPrefs}
      on:close={() => toggleFlag.contractPrefsDialog(false)}>
    </ContractPrefsDialog>
  {/if}
</form>

<script>
  const dispatch = svelte.createEventDispatcher();

  const { flag, toggleFlag } = utils.initFlags([
    'contractPrefsDialog',
  ]);

  let contract = conf.contracts[0].file;
  let newWalletPayload;

  async function walletAdded() {
    await tonMethods.addNewWallet(newWalletPayload);
    dispatch('walletAdded', newWalletPayload);
  }

  async function generateWallet(e) {
    const params = _.fromPairs(Array.from(new FormData(e.target)));
    const word_count = parseInt(params.word_count || 12, 10);
    const { phrase } = await tonMethods.getWalletData(null, false, { word_count }, contract);
    newWalletPayload = { phrase };

    if (contract && contract !== conf.contracts[0].file) {
      newWalletPayload.contract = contract;
    }

    if (newWalletPayload.contract && newWalletPayload.contract !== conf.contracts[0].file) {
      toggleFlag.contractPrefsDialog();
      return;
    }
    walletAdded();
  }

  function setContractPrefs(e) {
    toggleFlag.contractPrefsDialog(false);
    newWalletPayload[newWalletPayload.contract] = e.detail;
    setTimeout(walletAdded);
  }
</script>

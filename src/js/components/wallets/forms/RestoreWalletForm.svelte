
<div>
  <PhraseArea bind:phrase={phrase} placeholder={$$props.phrasePlaceholder}/>

  <div class='text-row'>
    <ContractPicker bind:value={phraseContract}></ContractPicker>
  </div>

  <button class="btn-blue font-bold full-width text-md" on:click={restoreWallet}>
    {$$props.submitLabel || t('actions.wallet.restore')}
  </button>
</div>

<script>
  const dispatch = svelte.createEventDispatcher();

  let phrase = '';
  let phraseContract = conf.contracts[0].file;

  async function restoreWallet() {
    if (!phrase) {
      return;
    }

    const [err, result] = await to(tonMethods.getWalletData(phrase));

    if (err) {
      utils.exception(err);
      return;
    }

    const network = conf.currentTonServer || conf.tonServers[0];
    const wallets = await utils.storage.getArrayValue('myPhrases', conf.myPin);

    if (_.find(wallets, w => w.phrase === phrase && w.network === network)) {
      utils.toast.error(t('info.wallet.exists'));
      return;
    }

    const payload = { phrase, network };

    if (phraseContract && phraseContract !== conf.contracts[0].file) {
      payload.contract = phraseContract;
    }

    dispatch('restore', payload);
  }
</script>

<div>
  {#if $$props.shown }
    <ModalDialog on:close={() => dispatch('close')} headline={t('actions.wallet.import_keys')}>
      <form on:submit|preventDefault={importKeys}>
        <div class='text-line'>
          <FormTextArea
            bind:value={rawValue}
            label={t('actions.wallet.paste_keys')} />
          <div class='text-xs color-label'>{t('actions.wallet.paste_keys_order')}</div>
        </div>


        <div class='text-line'>
          <ContractPicker bind:value={contract}></ContractPicker>
        </div>

        <button class="btn-blue font-bold full-width text-md" type="submit">
          {t('actions.wallet.import_keys')}
        </button>

      </form>
    </ModalDialog>
  {/if}

  {#if $flag.contractPrefsDialog}
    <ContractPrefsDialog
      label={t('actions.wallet.import_keys')}
      payload={newWalletPayload}
      on:close={() => toggleFlag.contractPrefsDialog(false)}>
    </ContractPrefsDialog>
  {/if}
</div>

<script>

  const dispatch = svelte.createEventDispatcher();
  let newWalletPayload;

  const { flag, toggleFlag } = utils.initFlags([
    'contractPrefsDialog',
  ]);

  let keys = {
    public: '',
    secret: '',
  };

  let rawValue;

  let contract = conf.contracts[0].file;

  function isValidKey(str) {
    return str.split('').length === 64;
  }

  async function importKeys() {
    const keysData = rawValue.split("\n").filter(isValidKey);

    keys.public = keysData[0] || '';
    keys.secret = keysData[1] || '';

    if (!tonMethods.isValidKey(keys.public)) {
      utils.toast.error(t('info.keys.invalid.public'));
      return;
    }

    if (!tonMethods.isValidKey(keys.secret)) {
      utils.toast.error(t('info.keys.invalid.secret'));
      return;
    }

    const [err, result] = await to(conf.tonClient.crypto.nacl_sign_keypair_from_secret_key({secret: keys.secret}));

    if (err) {
      utils.exception(err);
      return;
    }
    if (result.public !== keys.public) {
      utils.toast.error(t('info.keys.invalid.secret'));
      return;
    }

    newWalletPayload = { keys, contract };

    if (newWalletPayload.contract && newWalletPayload.contract !== conf.contracts[0].file) {
      toggleFlag.contractPrefsDialog();
      return;
    }

    dispatch('add-keys', newWalletPayload);
  }

</script>

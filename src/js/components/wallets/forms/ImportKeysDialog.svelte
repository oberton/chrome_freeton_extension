<div>
  {#if $$props.shown }
    <ModalDialog on:close={() => dispatch('close')} headline={t('actions.wallet.import_keys')}>
      <form on:submit|preventDefault={importKeys}>
        {#each ['public', 'secret'] as type}
          <FormControl
            required={true}
            type='text'
            bind:value={keys[type]}
            label={t('keys.' + type)} />
        {/each}

        <div class="gtr-ver text-right">
          <label class="btn-blue-light btn-round" with-tooltip={t('actions.wallet.upload_keys')}>
            <input on:change={fileAttached} id='import-file-input' type='file' style='position: absolute; left: -999em' />
            <span class="icon-upload text-lg"></span>
          </label>
        </div>
        <button class="btn-blue font-bold full-width text-md" type="submit">
          {t('actions.wallet.import_keys')}
        </button>

      </form>
    </ModalDialog>
  {/if}
</div>

<script>

  const dispatch = svelte.createEventDispatcher();

  let keys = {
    public: '',
    secret: '',
  };

  function isValidKey(str) {
    return str.split('').length === 64;
  }

  function fileAttached() {
    const fileInput = document.getElementById('import-file-input');
    const file = fileInput.files[0];
    if (file.size > 1024) {
      utils.toast.error(t('info.file.too_big'));
      return;
    }

    const fr = new window.FileReader();

    fr.onload = () => {
      const keysData = fr.result.split("\n").filter(isValidKey);

      if (keysData.length !== 2) {
        utils.toast.error(t('info.upload.invalid_keys'));
        return;
      }

      keys = {
        public: keysData[0],
        secret: keysData[1],
      };
    };

    fr.readAsText(file);
  }

  async function importKeys() {
    if (!isValidKey(keys.public)) {
      utils.toast.error(t('info.keys.invalid.public'));
      return;
    }

    if (!isValidKey(keys.secret)) {
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
    dispatch('add-keys', keys);
  }

</script>

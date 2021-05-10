<div>
  <ModalDialog headline={step === 'pin' ? 'Enter Pin' : t('actions.import_wallets')}>
    <div>
      {#if step === 'pin'}
        <PinForm
          placeholder='Pin of the backup'
          autofocus={true}
          pinError={pinError}
          on:submit={checkPin}>
        </PinForm>
      {:else}
        <div>
          <div>
            <FormTextArea
              bind:value={formData.content}
              label='Paste wallets backup text content'
              id='new-wallet-payload' />
          </div>
          {#if loggedIn}
            <div class='gtr-t'>
              <label class='pointer'>
                <div class='form-checkbox alg-m'>
                  <input type='checkbox' bind:checked={formData.toMerge} />
                  <span></span>
                </div>
                <div class='gtr-l-sm color-label smile alg-m pos-rel'>
                  Merge with my wallets
                </div>
              </label>
            </div>
          {/if}
          <div class='gtr-t'>
            <button on:click={importBackup} class='btn-blue font-bold full-width' type='button'>
              Import Backup
            </button>
          </div>
        </div>
      {/if}
    </div>
  </ModalDialog>
</div>

<script>
  export let loggedIn;

  const dispatch = svelte.createEventDispatcher();

  let formData = {};
  let pinError = false;
  let step;
  let payload;

  function importBackup() {
    if (!formData.content) {
      return;
    }

    payload = utils.safeJSONParse(formData.content);
    if (!payload || !payload.myPhrases) {
      utils.toast.error('Invalid Payload');
      return;
    }

    if (formData.toMerge) {
      step = 'pin';
      return;
    }
  }

  function showPinError() {
    pinError = true;
    setTimeout(() => {
      pinError = false;
    }, 250);
  }

  async function saveData(dataToRestore, pin) {

    if (_.isEmpty(dataToRestore.myPhrases)) {
      return;
    }

    if (conf.myPin) {
      const existingPhrases = await utils.storage.getArrayValue('myPhrases', conf.myPin);
      const existingStickers = await utils.storage.getArrayValue('myStickers', conf.myPin);

      const phrasesToImport = _.filter(dataToRestore.myPhrases, p => {
        const hasDup = _(existingPhrases)
          .map(p2 => _.isEqual(_.omit(p, 'tmpId'), _.omit(p2, 'tmpId')))
          .compact()
          .value()
          .length;
        return !hasDup;
      });

      const stickersToImport = _.filter(dataToRestore.myStickers, s => {
        const hasDup = _(existingStickers)
          .map(s2 => _.isEqual(_.omit(s, 'id'), _.omit(s2, 'id')))
          .compact()
          .value()
          .length;
        return !hasDup;
      });

      const myPhrases = [...(existingPhrases || []), ...phrasesToImport];
      utils.storage.setEncrypted('myPhrases', myPhrases, conf.myPin);
      if (!_.isEmpty(stickersToImport)) {
        const myStickers = [...(existingStickers || []), ...stickersToImport];
        utils.storage.setEncrypted('myStickers', myPhrases, conf.myPin);
      }

    } else if (!conf.myPin) {
      conf.myPin = pin;
      utils.storage.setEncrypted('myPhrases', dataToRestore.myPhrases, conf.myPin);
      if (!_.isEmpty(dataToRestore.myStickers)) {
        utils.storage.setEncrypted('myStickers', dataToRestore.myStickers, conf.myPin);
      }
    }
    dispatch('restored');
  }

  function checkPin(e) {
    setTimeout(async () => {
      try {
        const params = utils.crypto.decrypt(payload.myPhrases, e.detail);

        const myPhrases = utils.safeJSONParse(params);
        if (_.isEmpty(myPhrases)) {
          pinError();
          return;
        }

        const restorePayload = {myPhrases, toMerge: formData.toMerge};

        if (payload.myStickers) {
          const stickersParams = utils.crypto.decrypt(payload.myStickers, e.detail);
          if (stickersParams) {
            const myStickers = utils.safeJSONParse(stickersParams);
            if (!_.isEmpty(myStickers)) {
              restorePayload.myStickers = myStickers;
            }
          }
        }

        await saveData(restorePayload, e.detail);

      } catch(e) {
        showPinError();
      }
    });
  }

  svelte.onMount(() => {
    formData = {
      content: '',
      toMerge: true,
    };
  });
</script>

<form on:submit|preventDefault={addCustodian}>

  <div class='text-line'>
    {t('labels.custodians.add')}
  </div>

  <div class='text-xs upcase color-label gtr-b-sm'>
    {t('labels.choose_one')}
  </div>

  <div class='text-line text-center'>
    {#each tabs as tab}
      <div
        class='{"keys-btn pointer" + (formData.tab === tab.key ? " active" : "")}'
        on:click={() => setTab(tab.key)}
        use:tooltip data-tooltip={tab.tooltip}>
        <span class={tab.icon}></span>
      </div>
    {/each}
  </div>

  {#if formData.tab === 'publicKey'}
    <FormControl
      bind:value={formData.publicKey}
      label={t('labels.keys.public')}
      required={true}
      type='text'>
    </FormControl>
  {/if}

  {#if formData.tab === 'phrase'}
    <div class='tbl fixed'>
      <div class='tbl-cell alg-m gtr-r'>
        <PhraseArea
          bind:phrase={formData.phrase}
          placeholder={t('labels.master_password')}>
        </PhraseArea>
      </div>
      <div class='tbl-cell alg-m cell-gtr'>
        <button
          type='button'
          use:tooltip
          data-tooltip={t('actions.phrase.generate')}
          on:click={generateNewPhrase}
          class='btn-blue-glass btn-round'>
          <span class='icon-magic-wand'></span>
        </button>
      </div>
    </div>
  {/if}

  {#if formData.tab === 'keys'}
    <div>
      {#each ['public', 'secret'] as type}
        <FormControl
          required={true}
          type='text'
          bind:value={formData.keys[type]}
          label={t('labels.keys.' + type)} />
      {/each}
    </div>
  {/if}

  <div class='gtr-t'>
    <button class="btn-blue font-bold full-width text-md">
      {t('labels.custodians.add')}
    </button>
  </div>

</form>

<script>
  export let custodians;

  const dispatch = svelte.createEventDispatcher();

  let formData = {};

  const uploadFileInputId = `import-file-${utils.tmpId()}`;

  async function generateNewPhrase() {
    const word_count = (formData.phrase || '').split(' ').length === 12 ? 24 : 12;

    const { phrase } = await conf.tonClient.crypto.mnemonic_from_random({
      dictionary: 1,
      word_count,
    });

    formData.phrase = phrase;
    utils.eventBus.trigger('area-change', document.querySelector('.c-phrase-area textarea').id);
  }

  function addCustodian(e) {
    if (formData.tab === 'phrase') {
      if (!tonMethods.isValidPhrase(formData.phrase)) {
        utils.toast.error(t('info.phrase.invalid'));
        return;
      }
    } else if (formData.tab === 'publicKey') {
      formData.publicKey = formData.publicKey.replace(/^0:/, '');

      if (!tonMethods.isValidKey(formData.publicKey)) {
        utils.toast.error(t('info.keys.invalid.public'));
        return;
      }
    } else if (formData.tab === 'keys') {
      if (!tonMethods.isValidKey(formData.keys.public)) {
        utils.toast.error(t('info.keys.invalid.public'));
        return;
      }
      if (!tonMethods.isValidKey(formData.keys.secret)) {
        utils.toast.error(t('info.keys.invalid.secret'));
        return;
      }
    }

    const payload = _.pick(formData, formData.tab);

    const copyFound = _.find(custodians, c => _.isEqual(c, payload));

    if (copyFound) {
      utils.toast.error(t('info.custodians.already_exists'));
      return;
    }

    const tooltip = e.target.closest('.tooltip-menu');
    tooltip.__hideTooltip();

    dispatch('add', payload);
  }

  function setTab(tab) {
    formData = {
      tab,
      publicKey: '',
      phrase: '',
      keys: {
        public: '',
        secret: '',
      },
    };
  }

  const tabs = [{
    key: 'publicKey',
    tooltip: t('labels.custodians.set.public'),
    icon: 'icon-car-key text-sm',
  }, {
    key: 'phrase',
    tooltip: t('labels.custodians.set.phrase'),
    icon: 'icon-passkey text-md',
  }, {
    key: 'keys',
    tooltip: t('labels.custodians.set.keys'),
    icon: 'icon-keys-pair',
  }];

  svelte.onMount(() => {
    setTab('publicKey');
  });
</script>

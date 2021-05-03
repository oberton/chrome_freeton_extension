<div>
  {#if ready}
    <div class='tbl fixed'>
      {#if type}
        <div class='tbl-cell cell-gtr text-sm alg-m'>
          <div
            class='keys-btn'
            use:tooltip data-tooltip={types[type].tooltip}>
            <span class={types[type].icon}></span>
          </div>
        </div>
      {/if}
      <div class='tbl-cell text-xs gtr-l-sm alg-m gtr-t-xxs'>
        <AddressEllipsis take={12} address={publicKey}></AddressEllipsis>
      </div>
      <div class='tbl-cell cell-gtr alg-m'>
        <button
          on:click={removeItem}
          type='button'
          use:tooltip
          data-tooltip={t('actions.common.delete_item')}
          class="btn-red-light btn-round smile">
          <span class='icon-delete text-lg'></span>
        </button>
      </div>
    </div>
  {/if}
</div>
<script>

  export let custodian;

  const dispatch = svelte.createEventDispatcher();

  let type = '';
  let publicKey = '';
  let ready = false;

  function removeItem() {
    dispatch('remove', true);
  }

  const types = {
    publicKey: {
      icon: 'icon-car-key text-sm',
      tooltip: t('labels.keys.public'),
    },
    phrase: {
      icon: 'icon-passkey text-md',
      tooltip: t('labels.master_password'),
    },
    keys: {
      icon: 'icon-keys-pair',
      tooltip: t('labels.keys.pair'),
    },
  };

  svelte.onMount(async () => {
    if (!custodian) {
      return;
    }
    if (custodian.publicKey) {
      type = 'publicKey',
      publicKey = custodian.publicKey;
    } else if (custodian.keys) {
      type = 'keys';
      publicKey = custodian.keys.public;
    } else if (custodian.phrase) {
      type = 'phrase';
      const result = await tonMethods.phraseToKeys(custodian.phrase);
      publicKey = _.get(result, 'public', '-');
    }
    ready = true;
  });
</script>

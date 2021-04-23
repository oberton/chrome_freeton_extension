<div>
  {#if $$props.shown }
    <ModalDialog on:close={() => dispatch('close')} headline={t('actions.phrase.backup_keys')}>
      {#each ['public', 'secret'] as type}
        <div class='tbl fixed'>
          <div class='tbl-cell gtr-r alg-m'>
            <FormControl value={walletData.keys[type]} label={t('keys.' + type)} readonly={true} />
          </div>
          <div class='tbl-cell cell-gtr text-right alg-m gtr-t-2x'>
            <CopyTextBtn
              label={t('actions.copy_key.' + type)}
              value={walletData.keys[type]}>
            </CopyTextBtn>
          </div>
        </div>
      {/each}

      <div class='gtr-t text-right'>
        <button
          type="button"
          class="btn-blue-light btn-round"
          on:click={downloadKeys}
          use:tooltip
          data-tooltip={t('actions.wallet.download_keys')}>
          <span class="icon-download text-lg"></span>
        </button>
      </div>
    </ModalDialog>
  {/if}
</div>

<script>
  export let walletData;

  const dispatch = svelte.createEventDispatcher();

  function downloadKeys() {
    const content = [
      '----BEGIN OF PUBLIC KEY----',
      walletData.keys.public,
      '----END OF PUBLIC KEY----',
      '----BEGIN OF SECRET KEY----',
      walletData.keys.secret,
      '----END OF SECRET KEY----',
    ].join("\n");
    utils.saveToFile(content, `${walletData.wallet.address}.keys`);
  }

</script>

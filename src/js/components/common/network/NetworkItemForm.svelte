<div>

  <div class='text-line'>
    <div class='gtr-b-xs color-label text-xs gtr-l-xs'>
      {t('labels.name')}
    </div>
    <div class='row-hor-xs'>
      <StickerItem
        isNew={true}
        style='padding-left: 6px'
        autofocus={true}
        nameKey="name"
        placeholder={t('labels.name') + '...'}
        on:change={onChange}
        sticker={network}>
      </StickerItem>
    </div>
  </div>

  <label class='text-line' style='display: block;'>
    <TagsInput
      placeholder='+ URL [enter]'
      color={network.color}
      bind:value={network.endpoints}>
    </TagsInput>
  </label>

  <div class='clearfix'>
    <button
      on:click={submit}
      class={'btn-blue font-bold full-width' + (!(network && network.name && network.endpoints && network.endpoints.length) ? ' disabled' : '')}>
      {network.id ? t('labels.update') : t('labels.create')}
    </button>
  </div>

</div>

<script>
  export let network;

  const dispatch = svelte.createEventDispatcher();

  function onChange(e) {
    network = { ...network, ...e.detail };
  }

  function submit() {
    if (_.isEmpty(network.name) || _.isEmpty(network.endpoints)) {
      utils.toast.error('Name and URL cannot be empty');
      return;
    }
    dispatch('submit', network);
  }
</script>

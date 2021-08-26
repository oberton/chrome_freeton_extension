<div id={elId} class={parentStickers.length ? (nonEmptyClassName || '') : "smile alg-m"}>
  {#each parentStickers as sticker (sticker.id)}
    <div style={'border-radius: 2em; font-size: 0.7em; color:' +sticker.color} class='tag smile alg-m text-xs'>{sticker.text}</div>
  {/each}

  {#if mode !== "sm"}
    <div class='smile alg-m'>
      <button
        class='btn-blue-light btn-round'
        use:tooltip data-tooltip={t('sticker.add')}
        use:tooltipMenu
        on:click={refreshData}
        style='font-size: 10px'>
        <span class='icon-label text-lg'></span>
      </button>

      <div class='tooltip-menu' style='padding: 10px; width: 260px;'>
        <div>
          {#key newSticker}
            <StickerItem on:submit={addNewSticker} isNew={true} autofocus={true} sticker={newSticker}></StickerItem>
          {/key}
          {#if stickers && stickers.length}
            <div class='gtr-t all-stickers'>
              <div class='gtr-ver-xxs'>
                <div class='gtr-b-xs color-label'>
                  <div class='tbl fixed text-xs'>
                    <div class='tbl-cell color-blue text-right'>
                      {#if editing}
                        [enter] {t('sticker.to_save')} 
                      {:else}
                        [{metaKey} + click] {t('sticker.to_edit')}
                      {/if}
                    </div>
                  </div>
                </div>
              </div>
              <div class='c-draggable-root' on:sort={onItemsSorted}>
                {#each stickers as sticker (sticker.id)}
                  <div class='gtr-b-xxs' use:sortable data-id={sticker.id}>
                    <StickerItem
                      on:submit={saveStickers}
                      on:remove={() => removeSticker(sticker.id)}
                      on:focus={onStickerFocus}
                      on:blur={onStickerBlur}
                      parent={parent}
                      sticker={sticker}>
                    </StickerItem>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}

</div>

<script>

  export let parent;
  export let mode;
  export let nonEmptyClassName;

  let stickers = [];
  let parentStickers = [];
  let editing = false;
  let elId;

  const metaKey = navigator.platform.indexOf('Mac') > -1 ? '⌘' : 'Ctrl';

  const defaultPalette = [
    "#fc5c65",
    "#fd9644",
    "#00a953",
    "#2b9ecb",
    "#eb3b5a",
    "#fa8231",
    "#f7b731",
    "#20bf6b",
    "#45aaf2",
    "#4b7bec",
    "#a55eea",
    "#778ca3",
    "#2d98da",
    "#3867d6",
    "#8854d0",
    "#4b6584",
  ];

  let newSticker = {
    id: utils.tmpId(),
    color: _.sample(defaultPalette),
    text: '',
  };

  function setNewStickerColor(e) {
    newSticker.color = e.target.value;
  }

  function onItemsSorted(e) {
    const ids = e.detail;
    stickers = _.map(ids, id => _.find(stickers, s => s.id === id));
    utils.storage.setEncrypted('myStickers', stickers, conf.myPin);
  }

  function initNewSticker() {
    const prevColor = _.get(stickers, '0.color', '');
    newSticker = {
      id: utils.tmpId(),
      color: _.sample(_.without(defaultPalette, prevColor)),
      text: '',
    };
  }

  async function refreshData() {
    stickers = await utils.storage.getArrayValue('myStickers', conf.myPin);
    if (!stickers) {
      stickers = conf.initialStickers;
      await utils.storage.setEncrypted('myStickers', stickers, conf.myPin);
    }
    parentStickers = _.filter(stickers, s => _.includes(s.items, parent.tmpId));
    if (!stickers) {
      stickers = [];
    }
    initNewSticker();
  }

  function saveStickers() {
    parentStickers = _.filter(stickers, s => _.includes(s.items, parent.tmpId));
    utils.storage.setEncrypted('myStickers', stickers, conf.myPin);
  }

  async function addNewSticker() {
    if (newSticker.text && newSticker.color) {
      stickers = [
        {...newSticker, items: [parent.tmpId]},
        ...stickers,
      ];
      initNewSticker();
      saveStickers();
    }
  }

  svelte.onMount(async () => {
    elId = `form-${utils.tmpId()}`;
    await refreshData();
  });

  let blurTimeout;

  function onStickerFocus() {
    clearTimeout(blurTimeout);
    editing = true;
  }

  function onStickerBlur() {
    editing = false;
  }

  function removeSticker(sId) {
    stickers = _.filter(stickers, s => s.id !== sId);
    saveStickers();
  }
</script>

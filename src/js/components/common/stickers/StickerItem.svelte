<div
  style={[style, "color:" + sticker.color + "; cursor:" + (editing ? "text" : "pointer")].join(';')}
  on:click={onTagClick}
  class={"tag" + (parent && sticker && sticker.items && sticker.items.indexOf(parent.tmpId) > -1 ? " chosen" : "")}>

  <div class='tbl fixed hover-parent'>
    <div class='tbl-cell alg-m'>

      <input
        style={"color:" + sticker.color + "; cursor:" + (editing ? "text" : "pointer")}
        bind:value={stickerText}
        id={elId}
        on:keydown={onKeydown}
        on:blur={onBlur}
        disabled={!editing}
        use:appAutofocus
        data-autofocus={!!autofocus}
        placeholder={isNew ? placeholder || t('sticker.add_new_placeholder') : ''}
        type='text' />

    </div>
    {#if editing}
      <div class='tbl-cell alg-m text-right' style='width: 1rem' ignore-tooltip>
        <label class='pointer smile icon-colorize pos-rel' use:tooltip data-tooltip="Set color" on:click={showColorPicker}>
          <input
            type="color"
            on:change={setColor}
            value={sticker.color}
            style="width: 0; height: 0; position: absolute; top: 0; right: 0; visibility: hidden;" />
        </label>
      </div>
    {:else}
      <div class='tbl-cell alg-m text-right hover-parent-show' style='width: 1rem' ignore-tooltip>
        <span class='smile icon-delete' use:tooltip data-tooltip={t('sticker.remove')} on:click={removeItem}></span>
      </div>
    {/if}
  </div>
</div>

<script>
  export let sticker;
  export let autofocus;
  export let parent;
  export let placeholder;
  export let isNew;
  export let nameKey = 'text';
  export let style = '';

  let stickerText;
  let editing;
  let elId;

  const dispatch = svelte.createEventDispatcher();

  function focus() {
    const el = document.getElementById(elId);
    el.focus();
    el.selectionStart = el.selectionEnd = el.value.length;
  }

  function submit() {
    sticker[nameKey] = stickerText;
    dispatch('submit');
    if (!isNew) {
      editing = false;
    }
  }

  function onKeydown(e) {
    if (e && e.which === 13 && stickerText) {
      dispatch('blur');
      submit();
    } else if (e && e.which === 27) {
      stickerText = `${sticker[nameKey]}`;
      editing = false;
      dispatch('blur');
    }
    setTimeout(() => {
      dispatch('change', {sticker, [nameKey]: stickerText});
    });
  }

  function setColor(e) {
    sticker.color = e.target.value;
    editing = true;
    dispatch('focus');
    dispatch('change', {sticker});
    setTimeout(focus);
  }

  let submitTimeout;

  function onBlur(e) {
    if (!stickerText) {
      stickerText = `${sticker[nameKey]}`;
      return;
    }
    submitTimeout = setTimeout(submit, 150);
    dispatch('blur');
  }

  function showColorPicker() {
    clearTimeout(submitTimeout);
  }

  function removeItem(e) {
    dispatch('remove');
    e.preventDefault();
    e.stopPropagation();
  }

  svelte.onMount(() => {
    elId = `sticker-${utils.tmpId()}`;
    stickerText = `${sticker[nameKey] || ''}`;
    editing = !!isNew;
  });

  function onTagClick(e) {
    if (e.metaKey || e.ctrlKey) {
      editing = true;
      dispatch('focus');
      setTimeout(focus);
      return;
    }
    if (editing) {
      return;
    }
    sticker.items = _.includes(sticker.items, parent.tmpId)
      ? _.without(sticker.items, parent.tmpId)
      : [parent.tmpId, ...(sticker.items || [])];

    dispatch('blur');
    submit();
  }
</script>

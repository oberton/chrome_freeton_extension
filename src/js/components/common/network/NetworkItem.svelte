<div class='tbl fixed'>
  <div class='tbl-cell alg-m'>
    <div
      class='network-picker'
      style={"color:" + (server || {}).color}>

      <span class='alg-m text-sm smile icon-globe row-b-xxs'></span>
      <div class='smile alg-m'>
        {server.name}
      </div>
      {#if isMain}
        <span class='smile alg-m gtr-t-xxs text-xs icon-angle-down'></span>
      {/if}
    </div>
  </div>

  {#if !isMain && !server.isSystem }
    <div class='tbl-cell alg-m text-right' style='width: 68px'>
      <span class='smile row-r-xs'>
        <button
          use:tooltip
          data-tooltip={t('labels.edit')}
          tooltip-close
          on:click={((e) => {
            dispatch('edit', true);
            e.preventDefault();
            e.stopPropagation();
          })}
          type='button'
          class='btn-blue-light btn-round'>
          <span class="smile icon-pen text-lg"></span>
        </button>
      </span>

      <button
        use:tooltip
        data-tooltip={t('labels.delete')}
        tooltip-close
        on:click={((e) => {
          dispatch('delete', true);
          e.preventDefault();
          e.stopPropagation();
        })}
        type='button' class='btn-red-light btn-round'>
        <span class="smile icon-delete text-lg"></span>
      </button>

    </div>
  {/if}

</div>

<script>
  export let server;
  export let isMain;

  const dispatch = svelte.createEventDispatcher();

</script>

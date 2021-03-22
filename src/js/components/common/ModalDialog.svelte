<div class='modal-dialog' bind:this={currentBlock} on:click={onDialogClick}>
  <div class='tbl'>
    <div class='tbl-cell alg-m gtr-b-2x'>
      <div class='modal-dialog-content'>
        <div class='text-line'>
          <div class='tbl'>
            <div class='tbl-cell alg-m text-md'>
              {headline}
            </div>
            <div class='tbl-cell cell-gtr alg-m'>
              <div class="smile row-r-sm">
                <button
                  type="button"
                  on:click={hide}
                  class="btn-dim-light btn-round">
                  <span class="text-lg">&times;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <slot></slot>
      </div>
    </div>
  </div>
</div>

<script>
  let currentBlock;

  export let headline;

  const dispatch = svelte.createEventDispatcher();

  function hide() {
    currentBlock.classList.remove('shown');
    setTimeout(() => {
      dispatch('close', true);
    }, 100);
  }

  function onDialogClick(e) {
    if (e.target.closest('.modal-dialog-content')) {
      return;
    }
    hide();
  }

	svelte.onMount(async () => {
    currentBlock.parentElement.removeChild(currentBlock);
    document.body.appendChild(currentBlock);
    setTimeout(() => {
      currentBlock.classList.add('shown');
    }, 100);
	});

</script>

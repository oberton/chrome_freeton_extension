<div class='form-group'>
  <textarea
    rows='1'
    bind:value={value}
    on:keydown={onAreaKeydown}
    class={`form-control ${value ? "" : "empty"}`}
    required={$$props.required ? true : false}></textarea>

  <label class='form-label'>
    {$$props.label}
  </label>
</div>

<script>
  const dispatch = svelte.createEventDispatcher();

  export let value;

  function onAreaKeydown(e) {

    const target = e.target;

    if (e.which === 13) {
      e.preventDefault();
      return;
    }

    if (e.which === 32) {
      if (target.value[e.target.selectionEnd] === ' ' || target.value[e.target.selectionEnd - 1] === ' ') {
        e.preventDefault();
        return;
      }
    }

    setTimeout(() => {
      const styles = window.getComputedStyle(target);
      const paddings = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
      target.style.height = 'auto';
      target.style.height =  `${target.scrollHeight + 2}px`;
      dispatch('keydown', e);
    });
  }
</script>

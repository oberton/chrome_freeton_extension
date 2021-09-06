<div class='form-group'>
  <input
    type={$$props.type || "text"}
    class={"form-control " + (('' + value) ? "" : " empty")}
    value={value}
    min={$$props.min || undefined}
    max={$$props.max || undefined}
    step={$$props.step || undefined}
    readonly={$$props.readonly || undefined}
    on:input={onInput}
    autofocus={$$props.autofocus || undefined}
    required={$$props.required || false} />

    <label class='form-label'>
      <slot name='labelPrefix'></slot>
      {$$props.label}
    </label>
</div>

<script>
  export let value;

  const dispatch = svelte.createEventDispatcher();

  function onInput(e) {
    value = e.target.value;
    dispatch('change', value);
  }

</script>

<div class='form-group'>
  <input
    type={$$props.type || "text"}
    class={"form-control " + (('' + value) ? "" : " empty")}
    value={value}
    min={$$props.min || undefined}
    max={$$props.max || undefined}
    step={$$props.step || undefined}
    readonly={$$props.readonly || undefined}
    on:input={e => value = e.target.value}
    required={$$props.required || false} />

  <label class='form-label'>{$$props.label}</label>
</div>

<script>
  export let value;
</script>

<div class='form-group'>
  <input
    type={$$props.type || "text"}
    class={"form-control " + (('' + value) ? "" : " empty")}
    value={value}
    on:input={e => value = e.target.value}
    required={$$props.required || false} />

  <label class='form-label'>{$$props.label}</label>
</div>

<script>
  export let value;
</script>

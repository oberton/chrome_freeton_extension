<div style='margin: -2px;'>
  {#each value as url, index}
    <div
      style={'border-radius: 15px; padding-left: 8px; padding-right: 8px; font-size: 13px; margin: 2px 2px 2px 0; color:' + color}
      class='smile alg-m tag'>
      <div class='tbl fixed'>
        <div class='tbl-cell alg-m'>
          {url}
        </div>
        <div class='tbl-cell alg-m text-right' style='width: 17px' on:click={() => removeUrl(url)}>
          <span class='pointer'>&times;</span>
        </div>
      </div>
    </div>
  {/each}
  <input
    type='text'
    use:inputAutowidth
    style='padding: 4px 2px; display: inline-block; vertical-align: middle; margin: 2px;'
    bind:value={newUrl}
    on:keydown={onKeyDown}
    on:blur={() => addUrl(true)}
    class='form-control'
    placeholder={placeholder}/>
</div>

<script>

  const urlPattern = /^http[s]?:\/\/\S+$/

  let newUrl = '';

  export let placeholder = '';
  export let value = [];
  export let color = 'blue';

  function addUrl(silent = false) {
    if (!urlPattern.test(newUrl.trim())) {
      if (!silent) {
        utils.toast.error(t('info.url.invalid'));
      }
      return;
    }
    const url = newUrl.toLowerCase();
    value = [..._.without(value, url), url];
    newUrl = '';
  }

  function removeUrl(url) {
    value = _.without(value, url);
  }

  function onKeyDown(e) {
    if (e && e.which === 13) {
      addUrl();
    }
  }

</script>

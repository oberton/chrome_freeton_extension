<div class='form-select form-group'>
  <select
    on:change={() => updateCurrentNetwork()}
    bind:value={currentServer}>
    {#each tonServers as server}
      <option value={server}>{server}</option>
    {/each}
  </select>
  <label class='form-label'>
    Ton Sever
  </label>
</div>


<script>
  const dispatch = svelte.createEventDispatcher();

  function updateCurrentNetwork(tonServer) {
    setTimeout(() => {
      utils.storage.set({currentServer});
      conf.currentTonServer = currentServer;
      dispatch('change', conf.currentTonServer);
    });
  }

  const tonServers = conf.tonServers;
  let currentServer = conf.currentTonServer || conf.tonServers[0];
</script>

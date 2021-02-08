<div class='form-select'>
  <select
    on:change={() => updateCurrentNetwork()}
    bind:value={currentServer}>
    {#each tonServers as server}
      <option value={server}>{server}</option>
    {/each}
  </select>
  <label class='form-select-label'>
    Ton Sever
  </label>
</div>


<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

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

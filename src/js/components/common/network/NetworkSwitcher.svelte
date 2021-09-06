<div class='text-center pos-rel'>

  <div
    class='smile c-network-switcher'
    use:tooltipMenu
    placement='bottom-start'
    on:click={clearSearchText}>
    {#if currentServer}
      <NetworkItem
        server={currentServer}
        isMain={true}
        editable='false' />
    {/if}
  </div>

  <div class='tooltip-menu' style='width: 300px'>

    <div class='gtr-b-xs gtr-l gtr-r-xxs row-t-xs'>
      <div class='tbl fixed'>
        <div class='tbl-cell alg-m gtr-r alg-t' style='overflow: hidden'>
          <div class='row-t-2x'>
            <FormControl
              autofocus={true}
              type='text'
              on:change={onSearch}
              bind:value={searchText}
              label='...'>
              <span slot='labelPrefix' class='text-md icon-search smile alg-m gtr-r-xs'></span>
            </FormControl>
          </div>
        </div>
        <div class='tbl-cell cell-gtr alg-b gtr-t-sm'>
          <button
            type='button'
            class='btn-blue-light btn-round'
            on:click={() => editNetwork() }
            close-tooltip
            use:tooltip data-tooltip={t('labels.network.add')}>
            <span class='icon-add text-lg'></span>
          </button>
        </div>
      </div>
    </div>

    {#if !tonServers.length}
      <div class='gtr-ver-xs text-sm text-center color-dim'>
        {t('info.no_data')}
      </div>
    {/if}

    <div class='clearfix'>
      {#each tonServers as server}
        <div
          class='gtr-ver-xs gtr-hor-sm'
          close-tooltip
          on:click={() => setCurrentServer(server)}>
          <NetworkItem
            on:edit={() => editNetwork(server)}
            on:delete={() => removeNetwork(server.id)}
            server={server} />
        </div>
      {/each}
    </div>
  </div>

  {#if $flag.showNetworkForm }
    <ModalDialog
      on:close={closeEditNetworkForm}
      headline={networkToEdit.id ? t('labels.network.edit') : t('labels.network.add')}>

      <NetworkItemForm
        on:submit={handleSubmitNetworkForm}
        network={networkToEdit} />

    </ModalDialog>
  {/if}
</div>

<script>
  const dispatch = svelte.createEventDispatcher();

  let searchText = '';

  function decorateServers(serversObj) {
    return _.map(serversObj, (s, id) => ({
      ...s,
      id,
      isSystem: true,
    }));
  }

  let allTonServers = [
    ...decorateServers(conf.tonServers),
    ...(conf.customTonServers || []),
  ];

  let tonServers = allTonServers;

  function searchTonServers(pattern) {
    return _.filter(allTonServers, s => _.values(s).join('').toLowerCase().indexOf(pattern) > -1);
  };

  let searchTimeout;

  function onSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const pattern = searchText.trim().toLowerCase();
      tonServers = pattern ? searchTonServers(pattern) : allTonServers;
    }, 200);
  }

  let currentServer;

  const { flag, toggleFlag } = utils.initFlags([
    'showNetworkForm',
  ]);

  function clearSearchText() {
    searchText = '';
    tonServers = allTonServers;
  }

  let networkToEdit;

  function editNetwork(network) {
    networkToEdit = network || { color: _.sample(conf.uiColors) }
    toggleFlag.showNetworkForm(true);
  }

  function closeEditNetworkForm() {
    toggleFlag.showNetworkForm(false);
    setTimeout(() => {
      // trigger click, to open up the dropdown again
      document.querySelector('.c-network-switcher').__showTooltip();
    });
  }

  async function setCurrentServer(server) {
    currentServer = server;
    conf.currentTonServer = server.id;
    conf.tonClient = tonMethods.getClient();
    await utils.storage.set({currentServer: server.id})

    dispatch('change', server.id);
  }

  async function customTonServersChanged(customTonServers) {
    await utils.storage.set({customTonServers: JSON.stringify(customTonServers)}, null);
    conf.customTonServers = customTonServers;

    allTonServers = [
      ...decorateServers(conf.tonServers),
      ...(conf.customTonServers || []),
    ];

    onSearch();
  }

  async function removeNetwork(serverId) {
    const phrases = await utils.storage.getArrayValue('myPhrases');

    if (_.filter(phrases, p => p.network === serverId).length) {
      utils.toast.error(t('info.network.remove_has_wallets'));
      return;
    }

    let customTonServers = await utils.storage.getArrayValue('customTonServers', null);
    customTonServers = _.filter(customTonServers, s => s.id !== serverId);

    await customTonServersChanged(customTonServers);

    if (currentServer.id === serverId) {
      await setCurrentServer(allTonServers[0]);
    }

  }

  async function handleSubmitNetworkForm(e) {
    const network = e.detail;

    let customTonServers = await utils.storage.getArrayValue('customTonServers', null);

    if (!customTonServers) {
      customTonServers = [];
    }

    if (!network.id) {
      network.id = utils.tmpId();
    }

    const currentItem = _.find(customTonServers, s => s.id === network.id);

    if (currentItem) {
      _.assign(currentItem, network);
    } else {
      customTonServers.push(network);
    }

    await customTonServersChanged(customTonServers);

    if (currentServer.id === network.id) {
      currentServer = network;
    }

    toggleFlag.showNetworkForm(false);
  }

  svelte.onMount(() => {
    currentServer = _.find(allTonServers, s => s.id === conf.currentTonServer);
  });

</script>

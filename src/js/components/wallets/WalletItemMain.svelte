<div class='gtr-t-xs'>

  <div>
    <button
      type="button"
      class="btn-dim-light btn-round"
      on:click={() => dispatch('close')}
      use:tooltip
      data-tooltip={t('actions.go_back')}>
      <span class="text-md icon-arrow-left" style='color: #444;'></span>
    </button>

    <div class='smile alg-m text-lg'>
      {#key accountType}
        <div class='smile pos-rel'>
          <WalletGemIcon accountType={accountType} contract={wallet.contract}></WalletGemIcon>
          {#if pendingTransactions && pendingTransactions.length}
            <div
              class='badge'
              use:tooltip
              data-tooltip={t('info.transactions.has_pending', {count: pendingTransactions.length})}>
              {pendingTransactions.length}
            </div>
          {/if}
        </div>
      {/key}
    </div>
    <div class='text-md smile alg-m gtr-l-xs'>
      {balance.toFixed(3)}
    </div>
  </div>

  {#if pendingTransactions && pendingTransactions.length}
    <div class='gtr-ver-sm'>
      <div class='alert alert-warning pointer' on:click={toggleFlag.confirmPendingsDialog}>
        {#if pendingTransactions.length === 1}
          {t('info.transaction.pending.one')}
        {:else}
          {t('info.transaction.pending.many', {count: pendingTransactions.length})}
        {/if}
      </div>
    </div>
  {/if}

  {#if address && accountType}

    <div class='text-line'>
      <div class='tabs'>
        {#each ['messages', 'transactions'] as tab}
          <div
            class={"tabs-item cell-6" + (activeTab === tab ? " active" : "")}
            on:click={() => activeTab = tab}>
            {t('labels.wallet.' + tab)}
          </div>
        {/each}
      </div>
    </div>

    {#if activeTab === 'messages'}
      <AddressMessagesList
        hasAlert={pendingTransactions && pendingTransactions.length}
        address={address}>
      </AddressMessagesList>
    {:else if activeTab === 'transactions'}
      <AddressTransactionsList
        hasAlert={pendingTransactions && pendingTransactions.length}
        address={address}>
      </AddressTransactionsList>
    {/if}
  {/if}

  {#if $flag.confirmPendingsDialog}
    <ModalDialog on:close={() => toggleFlag.confirmPendingsDialog(false)} headline={t('confirm.transactions')}>
      <ConfirmTransactionsForm
        on:confirmed={onTransactionConfirmed}
        wallet={wallet}
        walletData={walletData}
        address={address}
        pendingTransactions={pendingTransactions}>
      </ConfirmTransactionsForm>
    </ModalDialog>
  {/if}
</div>

<script>
  export let wallet;

  const { flag, toggleFlag } = utils.initFlags([
    'confirmPendingsDialog',
  ]);

  const dispatch = svelte.createEventDispatcher();

  let walletData;
  let pendingTransactions;
  let accountType = '';
  let err;
  let activeTab = 'messages';

  let address;
  let contract;
  let balance = 0;

  async function loadPendingTransactions() {
    pendingTransactions = await tonMethods.getPendingTransactionIds(address, contract);
  }

  function onTransactionConfirmed() {
    loadPendingTransactions();
    toggleFlag.confirmPendingsDialog(false);
  }

  async function getBalance() {
    const [err, data] = await to(tonMethods.getBalance(address));

    if (err) {
      utils.exception(err);
    }

    balance = _.get(data, 'result.balance', 0) / 1000000000;
  }

  svelte.onMount(async () => {
    contract = wallet.contract || conf.contracts[0].file;

    if (wallet.phrase) {
      [err, walletData] = await to(tonMethods.getWalletData(wallet.phrase, false, {}, contract));
      if (err) {
        utils.exception(err);
        return
      }
    } else if (wallet.public && wallet.secret) {
      [err, walletData] = await to(tonMethods.getWalletByKeys(wallet, contract));

      if (err) {
        utils.exception(err);
        return
      }
    }

    address = _.get(walletData, 'wallet.address') || walletData.address;

    await getBalance();

    [err, accountType] = await to(tonMethods.getAccountType(address));

    if (!accountType) {
      accountType = 'Inactive';
    }

    if (err) {
      utils.exception(err);
      return
    }

    if (accountType === 'Active' && contract !== conf.contracts[0].file) {
      loadPendingTransactions();
    }

  });
</script>

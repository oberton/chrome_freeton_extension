<div>
  {#if address}
    <div class='gtr-r-2x text-line gtr-t-sm'>
      <div class='tbl fixed gtr-r-sm'>
        <div class='tbl-cell alg-m cell-gtr'>
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
        <div class='tbl-cell alg-m text-sm gtr-l'>
          <AddressEllipsis take='9' address={address}></AddressEllipsis>
        </div>
        <div class='tbl-cell alg-m cell-gtr'>
          <CopyTextBtn
            label={t('actions.address.copy')}
            value={address}>
          </CopyTextBtn>
        </div>
      </div>
    </div>
  {/if}

  {#if pendingTransactions && pendingTransactions.length}
    <div class='alert alert-warning pointer' on:click={toggleFlag.confirmPendingsDialog}>
      {#if pendingTransactions.length === 1}
        {t('info.transaction.pending.one')}
      {:else}
        {t('info.transaction.pending.many', {count: pendingTransactions.length})}
      {/if}
    </div>
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

  let walletData;
  let pendingTransactions;
  let accountType;
  let err;

  let address;
  let contract;

  async function loadPendingTransactions() {
    pendingTransactions = await tonMethods.getPendingTransactionIds(address, contract);
  }

  function onTransactionConfirmed() {
    loadPendingTransactions();
    toggleFlag.confirmPendingsDialog(false);
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

    address = _.get(walletData, 'wallet.address');

    [err, accountType] = await to(tonMethods.getAccountType(address));

    if (err) {
      utils.exception(err);
      return
    }

    if (accountType === 'Active' && contract !== conf.contracts[0].file) {
      loadPendingTransactions();
    }

  });
</script>

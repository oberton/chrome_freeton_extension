<div>
  Hello from wallet main
  {#if pendingTransactions && pendingTransactions.length}
    {#each pendingTransactions as transaction}
      <div>{transaction}!!!</div>
    {/each}
  {/if}
</div>

<script>
  export let wallet;

  let walletData;
  let pendingTransactions;
  let accountType;
  let err;

  svelte.onMount(async () => {
    const contract = wallet.contract || conf.contracts[0].file;

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

    const address = _.get(walletData, 'wallet.address');

    [err, accountType] = await to(tonMethods.getAccountType(address));

    if (err) {
      utils.exception(err);
      return
    }

    if (accountType === 'Active' && contract !== conf.contracts[0].file) {
      pendingTransactions = await tonMethods.getPendingTransactionIds(address, contract);
    }

    console.log(walletData);
  });
</script>

<div id={tmpId}>
  <div class='row'>
    <div class='text-line'>
      <div style='height: 16px;' class={'form-checkbox' + (selectedItems && selectedItems.length < transactionsToConfirm.length ? ' indeterminated' : '')} use:tooltipMenu>
        <input type='checkbox' checked={selectedItems && selectedItems.length} />
        <span></span>
      </div>
      <div class='tooltip-menu'>
        {#if selectedItems && selectedItems.length < transactionsToConfirm.length}
          <div class='tooltip-menu-item' close-tooltip on:click={() => toggleAllSelection(true)}>Select All</div>
        {/if}
        {#if selectedItems && selectedItems.length}
          <div class='tooltip-menu-item' close-tooltip on:click={() => toggleAllSelection(false)}>Deselect All</div>
        {/if}
      </div>
    </div>
    {#each transactionsToConfirm as transaction }
      <div class='text-line'>
        <label class='tbl pointer'>
          <div class='tbl-cell cell-2 alg-m'>
            <div class='form-checkbox'>
              <input type='checkbox' class='selected-transaction' checked data-id={transaction.id} on:change={updateSelection} />
              <span></span>
            </div>
          </div>
          <div class='tbl-cell cell-9 alg-m'>
            <div class='smile' use:tooltip data-tooltip={t('labels.amount')}>
              <TonAmount value={transaction.value}></TonAmount>
            </div>
            <div>
              <div class='tbl fixed'>
                <div class='tbl-cell text-xs cell-5 alg-m' use:tooltip data-tooltip={t('labels.from')}>
                  <AddressEllipsis address={transaction.creator} take={5}></AddressEllipsis>
                </div>
                <div class='tbl-cell cell-2 text-center alg-m color-light'>
                  <span class='icon-arrow-right'></span>
                </div>
                <div class='tbl-cell text-xs cell-5 alg-m' use:tooltip data-tooltip={t('labels.to')}>
                  <AddressEllipsis address={transaction.dest} take={4}></AddressEllipsis>
                </div>
              </div>

            </div>
          </div>
          <div class='tbl-cell cell-1 alg-m gtr-t-xxs'>
            <div class='smile'>
              <button
                type="button"
                use:tooltipMenu
                class="btn-dim-light btn-round">
                <span class="icon-ellipsis-v smile" style="padding-top: 2px;"></span>
              </button>
              <div class='tooltip-menu'>
                <div class='tooltip-menu-item' on:click={() => downloadTransaction(transaction)} close-tooltip>{t('confirm.download_transaction_info')}</div>
              </div>
            </div>
          </div>
        </label>
      </div>
    {/each}
  </div>
  <div class='gtr-t'>
    <button class='btn-blue font-bold full-width' type='button' on:click={confirmSelected}>
      {t('confirm.selected')}
    </button>
  </div>
</div>

<script>
  export let wallet;
  export let walletData;
  export let pendingTransactions;
  export let address;

  let selectedItems;
  let tmpId;
  let contract;

  let transactionsToConfirm = [];

  const dispatch = svelte.createEventDispatcher();

  function updateSelection() {
    selectedItems = _(document.querySelectorAll(`#${tmpId} .selected-transaction`))
      .filter('checked')
      .map(c => c.getAttribute('data-id'))
      .value();
  }

  function toggleAllSelection(checked) {
    _(document.querySelectorAll(`#${tmpId} .selected-transaction`)).each(c => {
      c.checked = checked;
    });
    updateSelection();
  }

  function downloadTransaction(transaction) {
    utils.saveToFile(JSON.stringify(transaction, null, 2), `${transaction.id}.json`);
  }

  async function confirmSelected() {
    if (_.isEmpty(selectedItems)) {
      return;
    }

    utils.page.showLoader();

    const keys = [];
    let walletKeys;

    if (wallet.keys) {
      walletKeys = wallet.keys;
    } else if (wallet.phrase) {
      walletKeys = await tonMethods.phraseToKeys(wallet.phrase);
    }

    const custodians = _.get(wallet, `${contract}.custodians`, []);

    for (let i = 0; i < custodians.length; i += 1) {
      const custodian = custodians[i];

      if (custodian.keys) {
        keys.push(custodian.keys);
      } else if (custodian.phrase) {
        const custodianKeys = await tonMethods.phraseToKeys(custodian.phrase);
        keys.push(custodianKeys);
      }
    }

    for (let i = 0; i < selectedItems.length; i += 1) {

      const transactionToConfirm = _.find(transactionsToConfirm, t => t.id === selectedItems[i]);

      let confirmKeys = _.cloneDeep(keys);

      const keysToTake = transactionToConfirm.signsRequired - transactionToConfirm.signsReceived;

      if (`0x${walletKeys.public}` === transactionToConfirm.creator) {
        confirmKeys.push(walletKeys);
      }

      confirmKeys = _.take(confirmKeys, keysToTake);

      for (let c = 0; c < confirmKeys.length; c += 1) {
        const [err, result] = await to(tonMethods.confirmTransaction(address, selectedItems[i], contract, confirmKeys[c]));
        if (err) {
          utils.exception(err);
        }
        console.log(result);
      }
    }

    utils.page.hideLoader();

    dispatch('confirmed', true);
  }

  svelte.onMount(async () => {
    tmpId = `confirm-form-${utils.tmpId()}`;

    contract = wallet.contract || conf.contracts[0].file;

    for (let i = 0; i < pendingTransactions.length; i += 1) {
      const { trans } = await tonMethods.getTransactionInfo(address, contract, pendingTransactions[i]);
      transactionsToConfirm.push(trans);
    }

    transactionsToConfirm = _.cloneDeep(transactionsToConfirm);
    selectedItems = _.map(transactionsToConfirm, 'id');
  });

</script>

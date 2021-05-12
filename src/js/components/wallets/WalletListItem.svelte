<div>
  <div class='tbl hover-parent'>
    <div class='tbl-cell alg-m'>
      <div class='gtr-t-xs'>

        <div class={'row-b-xs' + (accountType === 'Active' ? ' pointer' : '')} on:click={openWallet}>
          <div class='smile alg-m'>
            <div class='text-md'>
              {#key accountType}
                <div class='smile pos-rel'>
                  <WalletGemIcon accountType={accountType} contract={$$props.wallet.contract}></WalletGemIcon>
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
              {(balance || 0).toFixed(3)}
            </div>
          </div>
          <StickersForm nonEmptyClassName='row-l-sm gtr-b-xs' parent={$$props.wallet}></StickersForm>
        </div>

        <div>
          <div class='tbl' style='table-layout: fixed;'>
              <div class={'tbl-cell text-xs alg-m' + (accountType === 'Active' ? ' pointer' : '')} on:click={openWallet}>
              {#if address}
                <AddressEllipsis address={address}></AddressEllipsis>
              {/if}
            </div>
            <div class='tbl-cell alg-m' style='width: 3.5rem;'>
              <div class='smile row-t'>
                <CopyTextBtn
                  label={t('actions.address.copy')}
                  value={address}>
                </CopyTextBtn>
              </div>
            </div>
            <div class='tbl-cell alg-m' style='width: 4.5rem'>
              <div class='smile row-t'>

                <button
                  type="button"
                  use:tooltipMenu
                  class="btn-dim-light btn-round">
                  <span class="icon-ellipsis-v smile" style="padding-top: 2px;"></span>
                </button>

                <div class='tooltip-menu'>
                  {#if accountType === "Active"}
                    <div class='tooltip-menu-item' close-tooltip on:click={toggleFlag.sendCrystalFormDialog}>
                      {t('actions.tokens.send')}
                    </div>
                    <div class='tooltip-menu-item' close-tooltip on:click={toggleFlag.backupKeysDialog}>
                      {t('actions.phrase.backup_keys')}
                    </div>
                  {/if}
                  {#if multisigContracts.indexOf($$props.wallet.contract) > -1}
                    <div class='tooltip-menu-item' close-tooltip on:click={toggleFlag.manageCustodiansDialog}>
                      {t('actions.custodians.manage')}
                    </div>
                  {/if}
                  {#if walletData.phrase }
                    <div class='tooltip-menu-item' close-tooltip on:click={toggleFlag.pinFormDialog}>
                      {t('actions.phrase.backup')}
                    </div>
                  {/if}
                  <div class='tooltip-menu-item' close-tooltip on:click={() => dispatch('removeWallet', true)}>
                    {t('actions.common.delete_item')}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {#if $flag.phraseDialog }
      <ModalDialog on:close={() => toggleFlag.phraseDialog(false)} headline='Master Password'>
        <div style='user-select: none;'>
          <div class='text-line'>
            {walletData.phrase}
          </div>
          <div class='text-xs color-red'>
            {t('info.phrase.no_photo')}
          </div>
        </div>
      </ModalDialog>
    {/if}

    {#if $flag.manageCustodiansDialog}
      <ContractPrefsDialog
        payload={$$props.wallet}
        label={t('actions.save')}
        on:set={setContractPrefs}
        on:close={() => toggleFlag.manageCustodiansDialog(false)}>
      </ContractPrefsDialog>
    {/if}

    {#if $flag.pinFormDialog }
      <ModalDialog on:close={() => toggleFlag.pinFormDialog(false)} headline={t('actions.pin.enter')}>
        <PinForm pinError={pinError} on:submit={checkPin} />
      </ModalDialog>
    {/if}

    {#if $flag.sendCrystalFormDialog }
      <ModalDialog on:close={() => toggleFlag.sendCrystalFormDialog(false)} headline={t('actions.tokens.send')}>
        <SendTokensForm
          on:transactionSent={onTransactionSent}
          wallet={walletData.wallet}
          contract={$$props.wallet.contract}
          keys={walletData.keys}
          balance={balance} />
      </ModalDialog>
    {/if}

    <BackupKeysDialog
      walletData={walletData}
      on:close={() => toggleFlag.backupKeysDialog(true)}
      shown={$flag.backupKeysDialog}>
    </BackupKeysDialog>

  </div>

  {#if showDevTool}
    <form class='tbl' on:submit={stake}>
      <div class='tbl-cell text-md cell-4 gtr-r'>
        <div class='form-group'>
          <input class='form-control' bind:value={stakeForm.address} type='address' required />
          <label class='form-label'>Address</label>
        </div>
      </div>
      <div class='tbl-cell cell-4 gtr-r'>
        <div class='form-group'>
          <input class='form-control' bind:value={stakeForm.summ} type='number' required />
          <label class='form-label'>Summ</label>
        </div>
      </div>
      <div class='tbl-cell cell-4'>
        <button class='btn-blue btn-bold' type='submit'>Stake Now</button>
      </div>
    </form>
  {/if}
</div>


<script>

  // FIXME <debug vars>

  let stakeForm = {
    address: '',
    summ: 0,
  };

  function stake(e) {
    e.preventDefault();
    tonMethods.stakeNow(
      null,
      walletData.wallet.address,
      walletData.keys,
      $$props.wallet.contract || conf.contracts[0].file,
      '0:93c5a151850b16de3cb2d87782674bc5efe23e6793d343aa096384aafd70812c',
      '/sig-files/DePool.abi.json',
      '/sig-files/SetcodeMultisigWallet.abi.json',
    );
  }

  const showDevTool = NODE_ENV !== 'production' && conf.showDevTool;

  // FIXME </debug vars>

  const multisigContracts = [conf.contracts[1].file];

  const { flag, toggleFlag } = utils.initFlags([
    'phraseDialog',
    'pinFormDialog',
    'sendCrystalFormDialog',
    'backupKeysDialog',
    'manageCustodiansDialog',
  ]);

  const dispatch = svelte.createEventDispatcher();

  let walletData = {};
  let address = '';
  let balance = 0;
  let pendingTransactions;
  let accountType;

  let deploying = false;
  let pinError = false;

  let subscribeHandle;

  function checkPin(pin) {
    if (pin.detail !== conf.myPin) {
      pinError = true;
      setTimeout(() => {
        pinError = false;
      }, 150);
      return;
    }
    toggleFlag.pinFormDialog(false);
    toggleFlag.phraseDialog(true);
  }

  function onTransactionSent() {
    toggleFlag.sendCrystalFormDialog(false);
    utils.toast.info(t('info.transaction.sent'));
  }

  async function extractWalletOwners(wallet, keys) {
    const customContract = wallet.contract && wallet[wallet.contract];
    const owners = [`0x${keys.public}`];
    if (!customContract || _.isEmpty(customContract.custodians)) {
      return owners;
    }
    for (let i = 0; i < customContract.custodians.length; i += 1) {
      const custodian = customContract.custodians[i];
      if (custodian.keys && custodian.keys.public) {
        owners.push(`0x${custodian.keys.public}`);
      } else if (custodian.phrase) {
        const keys = await tonMethods.phraseToKeys(custodian.phrase);
        owners.push(`0x${keys.public}`);
      }
    }
    return owners;
  }

  async function deployContract() {
    if (deploying) {
      return;
    }

    if (_.get($$props, 'wallet.deploying')) {
      return;
    }

    deploying = true;

    const contract = $$props.wallet.contract || conf.contracts[0].file;
    const owners = await extractWalletOwners($$props.wallet, walletData.keys);
    const [err, result] = await to(tonMethods.deployWalletContract(
      walletData.keys,
      contract,
      owners,
      walletData.wallet.address,
      +_.get($$props, `wallet.${contract}.minConfirms`) || 1
    ));

    if (err) {
      utils.exception(err);
      return;
    }

    await utils.storage.assign('myPhrases', $$props.wallet.tmpId, {deploying: true}, conf.myPin);
    getBalance();
  }

  function openWallet(e) {
    if (e.target.closest('button')) {
      return;
    }
    if (!accountType || accountType !== 'Active') {
      return;
    }
    dispatch('open');
  }

  async function setBalance(_balance) {
    balance = _balance / 1_000_000_000;

    let err;

    if (!accountType) {
      [err, accountType] = await to(tonMethods.getAccountType(walletData.wallet.address));

      if (err) {
        utils.exception(err);
        return;
      }
    }

    if (accountType && accountType !== 'Active' && balance >= 0.5) {
      deployContract();
    }

    if (!accountType) {
      accountType = 'Inactive';
    }

    if (accountType === 'Active' && _.get($$props, 'wallet.contract') !== conf.contracts[0].file) {
      pendingTransactions = await tonMethods.getPendingTransactionIds(address, $$props.wallet.contract);
    }
  }

  async function getBalance() {
    const [err, data] = await to(tonMethods.getBalance(address));

    if (err) {
      utils.exception(err);
    }

    setBalance(_.get(data, 'result.balance'));
  }

  function onBalanceChangeCallback(data) {
    setBalance(parseInt(_.get(data, 'result.balance')));
  }

  async function setContractPrefs(e) {
    $$props.wallet[$$props.wallet.contract] = e.detail;
    await utils.storage.assign('myPhrases', $$props.wallet.tmpId, _.pick($$props.wallet, $$props.wallet.contract), conf.myPin);
    toggleFlag.manageCustodiansDialog(false);
  }

  svelte.onMount(async () => {
    if ($$props.wallet.phrase) {
      walletData = await tonMethods.getWalletData($$props.wallet.phrase, false, {}, $$props.wallet.contract);
    } else if ($$props.wallet.secret && $$props.wallet.public) {
      const keys = {
        public: $$props.wallet.public,
        secret: $$props.wallet.secret,
      };
      const wallet = await tonMethods.getWalletByKeys(keys, $$props.wallet.contract);
      walletData = { wallet, keys };
    }
    address = _.get(walletData, 'wallet.address');
    getBalance();
    subscribeHandle = await tonMethods.subscribeForBalance([walletData.wallet.address], onBalanceChangeCallback);
  });

  svelte.onDestroy(async () => {
    if (subscribeHandle) {
      await tonMethods.unsubscribe(subscribeHandle);
    }
  });
</script>

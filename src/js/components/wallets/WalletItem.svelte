<div class='tbl hover-parent'>
  <div class='tbl-cell alg-m'>
    <div class='gtr-ver-xs'>
      <div class='text-md'>
        {#key accountType}
          <WalletGemIcon accountType={accountType} contract={$$props.wallet.contract}></WalletGemIcon>
        {/key}
        {(balance || 0).toFixed(3)}
      </div>
      <div class='row-r-sm row-t-sm'>
        <div class='tbl' style='table-layout: fixed;'>
          <div class='tbl-cell text-xs'>
            <div class='ellipsis'>
              {address}
            </div>
          </div>
          <div class='tbl-cell' style='width: 3.5rem;'>
            <CopyTextBtn
              label={t('actions.address.copy')}
              value={address}>
            </CopyTextBtn>
          </div>
          <div class='tbl-cell alg-m' style='width: 3.5rem'>
            <div class='smile'>

              <button
                type="button"
                use:tooltipMenu
                class="btn-dim-light btn-round">
                <span class="icon-ellipsis-v smile" style="padding-top: 2px;"></span>
              </button>

              <div class='tooltip-menu'>
                <div class='tooltip-menu-item' close-tooltip on:click={() => dispatch('removeWallet', true)}>
                  {t('actions.common.delete_item')}
                </div>
                {#if walletData.phrase }
                  <div class='tooltip-menu-item' close-tooltip on:click={toggleFlag.pinFormDialog}>
                    {t('actions.phrase.backup')}
                  </div>
                {/if}
                {#if accountType === "Active"}
                  <div class='tooltip-menu-item' close-tooltip on:click={toggleFlag.backupKeysDialog}>
                    {t('actions.phrase.backup_keys')}
                  </div>
                  <div class='tooltip-menu-item' close-tooltip on:click={toggleFlag.sendCrystalFormDialog}>
                    {t('actions.tokens.send')}
                  </div>
                {/if}
             </div>

            </div>
          </div>
        </div>
      </div>

      <!--<form class='tbl' on:submit={stake}>
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
      </form>-->

    </div>
  </div>

  {#if $flag.phraseDialog }
    <ModalDialog on:close={toggleFlag.phraseDialog} headline='Master Password'>
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

  {#if $flag.pinFormDialog }
    <ModalDialog on:close={toggleFlag.pinFormDialog} headline={t('actions.pin.enter')}>
      <PinForm pinError={pinError} on:submit={checkPin} />
    </ModalDialog>
  {/if}

  {#if $flag.sendCrystalFormDialog }
    <ModalDialog on:close={toggleFlag.sendCrystalFormDialog} headline={t('actions.tokens.send')}>
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
    on:close={toggleFlag.backupKeysDialog}
    shown={$flag.backupKeysDialog}>
  </BackupKeysDialog>

</div>

<script>
  const { flag, toggleFlag } = utils.initFlags([
    'phraseDialog',
    'pinFormDialog',
    'sendCrystalFormDialog',
    'backupKeysDialog',
  ]);

  const dispatch = svelte.createEventDispatcher();

  let walletData = {};
  let address = '';
  let balance = 0;
  let accountType;

  let deploying = false;
  let balanceTimeout;

  let pinError = false;

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

  let stakeForm = {
    address: '',
    summ: 0,
  };

  async function deployContract() {
    if (deploying) {
      return;
    }

    deploying = true;

    const contract = $$props.wallet.contract || conf.contracts[0].file;

    const [err, result] = await to(tonMethods.deployWalletContract(walletData.keys, contract, [`0x${walletData.keys.public}`], walletData.wallet.address));

    if (err) {
      utils.exception(err);
      return;
    }

    getBalance();
  }

  async function getBalance() {
    clearTimeout(balanceTimeout);

    let err, data;

    [err, data] = await to(tonMethods.getBalance(address));

    if (err) {
      utils.exception(err);
    }

    balance = _.get(data, 'result.balance', 0) / 1000000000;

    [err, accountType] = await to(tonMethods.getAccountType(walletData.wallet.address));

    if (err) {
      utils.exception(err);
      return;
    }

    if (accountType && accountType !== 'Active' && balance >= 0.5) {
      deployContract();
    }

    balanceTimeout = setTimeout(getBalance, 30000);
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
  });
</script>

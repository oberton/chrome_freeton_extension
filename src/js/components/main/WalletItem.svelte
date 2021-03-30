<div class='tbl hover-parent'>
  <div class='tbl-cell alg-m'>
    <div class='gtr-ver-xs'>
      <div class='text-md'>
        <span class={"icon-gem smile alg-m gtr-r-xs color-" + (accountType === "Active" ? "blue" : "dim")}></span>
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
            <button
              type='button'
              class='btn-blue-light btn-round'
              with-tooltip={copying ? t('info.copied') : t('actions.address.copy')}
              on:click={() => copyAddress(address)}>
                <span class='icon-copy text-lg'></span>
            </button>
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
                <div class='tooltip-menu-item' close-tooltip on:click={removeWallet}>
                  {t('actions.common.delete_item')}
                </div>
                <div class='tooltip-menu-item' close-tooltip on:click={backupWallet}>
                  {t('actions.phrase.backup')}
                </div>
                {#if accountType === "Active"}
                  <div class='tooltip-menu-item' close-tooltip on:click={sendCrystals}>
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

  {#if showPhraseDialog }
    <ModalDialog on:close={() => showPhraseDialog = false} headline='Master Password'>
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

  {#if showPinForm }
    <ModalDialog on:close={() => showPinForm = false} headline={t('actions.pin.enter')}>
      <PinForm pinError={pinError} on:submit={checkPin} />
    </ModalDialog>
  {/if}

  {#if showSendCrystalsForm }
    <ModalDialog on:close={() => showSendCrystalsForm = false} headline={t('actions.tokens.send')}>
      <SendTokensForm
        on:transactionSent={onTransactionSent}
        wallet={walletData.wallet}
        keys={walletData.keys}
        balance={balance} />
    </ModalDialog>
  {/if}
</div>

<script>
  const dispatch = svelte.createEventDispatcher();
  let walletData = {};
  let address = '';
  let balance = 0;
  let accountType;

  let pinError = false;

  let showPhraseDialog = false;

  function removeWallet() {
    dispatch('removeWallet', true);
  }

  function checkPin(pin) {
    if (pin.detail !== conf.myPin) {
      pinError = true;
      setTimeout(() => {
        pinError = false;
      }, 150);
      return;
    }
    showPinForm = false;
    showPhraseDialog = true;
  }

  let showPinForm = false;
  function backupWallet() {
    showPinForm = true;
  }

  let showSendCrystalsForm = false;
  function sendCrystals() {
    showSendCrystalsForm = true;
  }

  function onTransactionSent() {
    showSendCrystalsForm = false;
    utils.toast.info(t('info.transaction.sent'));
  }

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
      '0:93c5a151850b16de3cb2d87782674bc5efe23e6793d343aa096384aafd70812c',
      '/sig-files/DePool.abi.json',
      '/sig-files/SetcodeMultisigWallet.abi.json',
      stakeForm.summ
    );
  }

  let copying = false;

  function copyAddress(text) {
    copying = true;
    utils.copyToClipboard(text);
    setTimeout(() => {
      copying = false;
    }, 200);
  }

  let deploying = false;

  async function deployContract() {
    if (deploying) {
      return;
    }

    deploying = true;

    const tvcDir = '/sig-files/SetcodeMultisigWallet2.tvc';
    const abiDir = '/sig-files/SetcodeMultisigWallet.abi.json';

    const [err, result] = await to(tonMethods.deployWalletContract(walletData.keys, abiDir, tvcDir, [`0x${walletData.keys.public}`], walletData.wallet.address));

    if (err) {
      utils.exception(err);
      return;
    }

    getBalance();
  }

  let balanceTimeout;
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
    walletData = await tonMethods.getWalletData($$props.wallet.phrase);
    address = _.get(walletData, 'wallet.address');
    getBalance();
  });
</script>

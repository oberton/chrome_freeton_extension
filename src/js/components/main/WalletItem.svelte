<div class='tbl hover-parent'>
  <div class='tbl-cell alg-m'>
    <div class='gtr-ver'>
      <div class='text-md'>
        {(balance || 0).toFixed(3)}
      </div>
      <div class='row-r-sm'>
        <div class='tbl' style='table-layout: fixed;'>
          <div class='tbl-cell text-sm'>
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
                 <div class='tooltip-menu-item' close-tooltip on:click={sendCrystals}>
                  {t('actions.tokens.send')}
                </div>
             </div>

            </div>
          </div>
        </div>
      </div>

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
      <SendTokensForm wallet={walletData.wallet} />
    </ModalDialog>
  {/if}
</div>

<script>
  const dispatch = svelte.createEventDispatcher();
  let walletData = {};
  let address = '';
  let balance = 0;

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

	svelte.onMount(async () => {
    walletData = await tonMethods.getWalletData($$props.wallet.phrase);
    address = _.get(walletData, 'wallet.address');
    try {
      const data = await tonMethods.getBalance(address);
      balance = _.get(data, 'result.balance', 0) / 1000000000;
    } catch(e) {
      balance = 0;
    }
  });
</script>

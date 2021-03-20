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
            <button type='button' class='btn-blue-light btn-round' with-tooltip={copying ? "Copied!" : "Copy Address"} on:click={() => copyAddress(address)}>
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
                  Delete
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <form class='tbl' on:submit={stake} style='display: none;'>
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
</div>

<script>
  import { onMount } from 'svelte';
  import { tooltipMenu } from 'js/directives/tooltipMenu.dir.js';

  const dispatch = createEventDispatcher();
  let walletData = {};
  let address = '';
  let balance = 0;

  function removeWallet() {
    dispatch('removeWallet', true);
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

	onMount(async () => {
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

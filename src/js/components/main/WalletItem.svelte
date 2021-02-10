<div class='tbl hover-parent'>
  <div class='tbl-cell alg-m gtr-r'>
    <div class='gtr-ver'>
      <div class='text-md'>
        {balance}
      </div>
      <div>
        <div class='tbl' style='table-layout: fixed;'>
          <div class='tbl-cell gtr-r text-sm'>
            <div class='ellipsis'>
              {address}
            </div>
          </div>
          <div class='tbl-cell gtr-l' style='width: 3.5rem;'>
            <button type='button' class='btn-blue-light btn-round' with-tooltip={copying ? "Copied!" : "Copy Address"} on:click={() => copyAddress(address)}>
              <span class='icon-copy text-lg'></span>
            </button>
          </div>
          <div class='tbl-cell alg-m hover-parent-show' style='width: 3.5rem'>
            <button type='button' class='btn-red-light btn-round' with-tooltip='Remove' on:click={removeWallet}>
              <span class='icon-delete text-lg'></span>
            </button>
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
</div>

<script>
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';

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
    tonMethods.stakeNow(walletData, stakeForm);
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

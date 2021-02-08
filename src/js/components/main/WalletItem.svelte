<div class='tbl hover-parent'>
  <div class='tbl-cell alg-m gtr-r'>
    <div class='gtr-ver'>
      <div class='text-sm color-light'>{$$props.wallet.network}</div>
      <div>{$$props.wallet.phrase}</div>
      <h2>{balance}</h2>
      <div>{address}</div>
    </div>
  </div>
  <div class='tbl-cell alg-m hover-parent-show' style='width: 30px'>
    <button type='button' class='btn-red-light btn-round' with-tooltip='Remove' on:click={removeWallet}>
      <span class='icon-delete text-lg'></span>
    </button>
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

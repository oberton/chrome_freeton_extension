<span use:tooltip data-tooltip={getContractName()} class={getClassName()}></span>

<script>
  export let contract = '';
  export let accountType = '';


  function getContractName() {
    return (_.find(conf.contracts, c => c.file === contract) || conf.contracts[0]).name;
  }

  function getClassName() {
    return [
      'smile',
      'alg-m',
      'gtr-r-xs',
      accountType === 'Active' ? 'color-blue' : 'color-dim',
      contract === 'SafeMultisigWallet' ? 'icon-gems' : 'icon-gem',
    ].join(' ');
  }
</script>

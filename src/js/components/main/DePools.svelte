<div>
  <table>
    <tbody>
      {#each depools as depool }
        <tr>
          <td>{depool.balance}</td>
          <!--
          <td>{depool.id}</td>
          <td>{depool.acc_type_name}</td>
          <td>{depool.code_hash}</td>
          -->
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<script>
  let depools = [];
  svelte.onMount(async () => {
    depools = await tonMethods.getDepools();
  });
</script>

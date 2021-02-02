const template = `
<div class='fadeIn'>
  <network-select></network-select>
  <div class='text-md gtr-b-2x'>Hello</div>
   <% _.forEach(phrases, (wallet, index) => { %>
    <div class='text-line'>
      <!--<div class='tbl'>
        <div class='tbl-cell'>
          <div><%- wallet.network %></div>
          <div><%- wallet.passphrase %></div>
        </div>
        <div class='tbl-cell'>
          <button c-click='removeWallet(<%- index %>)'>%&times;</button>
        </div>
      </div>-->
      <wallet-preview wallet='wallet'></wallet-preview>
    </div>
  <% }); %>
  <div>
    <button c-click='createWallet' class='btn-blue-light font-bold full-width' type='button'>Create Wallet</button>
  </div>
</div>
`;

async function removeWallet(index) {
  this.params.phrases = await utils.storage.splice('myPhrases', +index, 1, conf.myPin);
  this.$$reRender();
}

async function createWallet() {
  await tonMethods.createWallet();
  this.params.phrases = await utils.storage.getArrayValue('myPhrases', conf.myPin);
  this.$$reRender();
}

function render(app, params) {

  return utils.createComponent(app, params, null, template, {
    createWallet,
    removeWallet,
  });
}

export default render;

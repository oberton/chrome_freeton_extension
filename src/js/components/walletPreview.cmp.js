const template = `
<div>
  <%- wallet.network %>
</div>
`;

function render(app, params) {
  return utils.createComponent(app, params, null, template, {
  });
}

export default render;

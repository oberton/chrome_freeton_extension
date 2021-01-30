const template = `<div class='text-line text-center'>
  <div class='smile' style='width: 120px'>
    <select class='form-control'>
      <% _.forEach(conf.tonServers, (server) => { %>
        <option><%- server %></option>
      <% }); %>
    </select>
  </div>
</div>`;

function render(app, params, callbacks) {

  const $cmp = utils.createComponent(app, params, callbacks, template, {
  });

  return $cmp;
}

export default render;

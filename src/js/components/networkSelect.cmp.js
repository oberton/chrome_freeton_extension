const template = `<div class='text-line'>
  <div class='smile' style='width: 120px'>

    <select class='form-select'>
      <% _.forEach(conf.tonServers, (server) => { %>
        <option><%- server %></option>
      <% }); %>
    </select>

  </div>
</div>`;

async function render(app, params, callbacks) {

  const $cmp = utils.createComponent(app, params, callbacks, template, {
  });


  return $cmp;
}

export default render;

function getEventElements(element) {
  const nodes = [...element.querySelectorAll('*')];
  return nodes.filter((i) => i.getAttributeNames().filter((a) => a.match(/^c-.*$/)).length);
}

function createComponent(app, params, callbacks, template, methods) {
  const destroyCallbacks = [];

  const $cmp = {};

  $cmp.app               = app;
  $cmp.element           = document.createElement('div');
  $cmp.element.innerHTML = template;
  $cmp.params            = params;
  $cmp.callbacks         = callbacks;

  app.appendChild($cmp.element);
  app.currentComponent = $cmp;

  if ($cmp.params) {
    for (const key in $cmp.params) {
      const $ref = $cmp.element.querySelector(`[bind="${key}"]`);
      if ($ref && params[key]) {
        $ref.innerText = params[key];
      }
    }
  }

  if (methods) {
    for (const key in methods) {
      $cmp[key] = methods[key].bind($cmp);
    }
  }

  $cmp.onDestroy = (cb) => {
    destroyCallbacks.push(cb);
  };

  const eventElements = getEventElements($cmp.element);

  _.each(eventElements, el => {
    const attributes = el.getAttributeNames().filter((a) => a.match(/^c-.*$/));
    _.each(attributes, attr => {
      const eventName = attr.split('-');
      const methodName = el.getAttribute(attr);
      const method = $cmp[methodName];
      if (eventName && _.isFunction(method)) {
        el.addEventListener(eventName[1], method);
        $cmp.onDestroy(() => {
          el.removeEventListener(eventName[1], method);
        });
      }
    });
  });

  $cmp.destroy = () => {
    _.each(destroyCallbacks, cb => cb());
    $cmp.element.remove();
    $cmp.element = undefined;
  };

  return $cmp;
}

export default createComponent;

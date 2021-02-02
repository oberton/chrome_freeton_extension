import components from 'js/components';

let allComponentTags;

function getAllComponentTags() {
  return _(components)
    .keys()
    .map(k => [k.replace(/([A-Z]{1})/g, '-$1'), k])
    .fromPairs()
    .value();
}

function getEventElements(element) {
  const nodes = [...element.querySelectorAll('*')];
  return nodes.filter((i) => i.getAttributeNames().filter((a) => a.match(/^c-.*$/)).length);
}

function createComponent(app, params, callbacks, template, methods) {
  const destroyCallbacks = [];

  let $cmp = {};

  $cmp.app               = app;
  $cmp.element           = document.createElement('div');
  $cmp.element.innerHTML = _.template(template)({...params, app: $cmp.app, conf, $cmp: components });

  $cmp.params            = params;
  $cmp.callbacks         = callbacks;

  $cmp.$$reRender = () => {
    $cmp.destroy();
    $cmp = createComponent($cmp.app, $cmp.params, $cmp.callbacks, template, methods);
  };

  if (!allComponentTags) {
    allComponentTags = getAllComponentTags();
  }

  _.each(allComponentTags, (cmpName, tagName) => {
    const tags = $cmp.element.getElementsByTagName(tagName);
    if (!tags.length) {
      return;
    }
    debugger
    _.each(tags, tag => components[cmpName](tag, params));
  });

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
      const methodName = el.getAttribute(attr).split('(')[0];
      const method = $cmp[methodName];
      const args = (el.getAttribute(attr).split(/[\(\)]/)[1] || '').split(/\s*,\s*/);
      const fn = () => method(...args);
      if (eventName && _.isFunction(method)) {
        el.addEventListener(eventName[1], fn);
        $cmp.onDestroy(() => {
          el.removeEventListener(eventName[1], fn);
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

function createComponent(app, params, callbacks, template, methods) {
  const $cmp = {};

  $cmp.element           = document.createElement('div');
  $cmp.element.innerHTML = template;
  $cmp.params            = params;
  $cmp.callbacks         = callbacks;

  app.appendChild($cmp.element);

  if ($cmp.params) {
    for (const key in $cmp.params) {
      const $ref = $cmp.element.querySelector(`[bind="${key}"]`);
      if ($ref) {
        $ref.innerText = params[key];
      }
    }
  }

  if (methods) {
    for (const key in methods) {
      $cmp[key] = methods[key].bind($cmp);
    }
  }

  $cmp.destroy = () => {
    if (typeof $cmp.onDestroy === 'function') {
      $cmp.onDestroy();
    }
    $cmp.element.remove();
    $cmp.element = undefined;
  };

  return $cmp;
}

export default createComponent;

const loaderTpl = `
<div class='tbl'>
  <div class='tbl-cell alg-m text-center'>
    <div class='lds-roller'>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</div>
`;

function showLoader() {
  if (document.querySelector('.lds-roller-wrapper')) {
    return;
  }
  const el = document.createElement('div');
  el.classList.add('lds-roller-wrapper');
  el.innerHTML = loaderTpl;
  document.body.appendChild(el);
}

function hideLoader() {
  const el = document.querySelector('.lds-roller-wrapper');
  if (!el) {
    return;
  }
  el.remove();
}

export default {
  hideLoader,
  showLoader,
};

import createComponent from '../utils/createComponent';

const template = `
<div>
  <div class='text-md gtr-b-2x'>Hello</div>
  <div bind='passphrase' class='color-dim gtr-b'></div>
</div>
`;

function render(app, params) {
  return createComponent(app, params, null, template);
}

export default render;

export default function(node) {
  if (node.getAttribute('data-autofocus') !== 'false') {
    setTimeout(() => {
      node.focus();
    });
  }
}

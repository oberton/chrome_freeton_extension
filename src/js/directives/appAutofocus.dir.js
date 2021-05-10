export default function scrollable(node) {
  if (node.getAttribute('data-autofocus') !== 'false') {
    setTimeout(() => {
      node.focus();
    });
  }
}

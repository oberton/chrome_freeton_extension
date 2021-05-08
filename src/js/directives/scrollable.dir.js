export default function scrollable(node) {
  const onScroll = () => {
    const distanceToBottom = node.scrollHeight - node.scrollTop - node.clientHeight;
    if (distanceToBottom < 80) {
      node.dispatchEvent(new window.CustomEvent('bottom', {}));
    }
  };

  node.addEventListener('scroll', onScroll);

  return {
    destroy() {
      node.removeEventListener('scroll', onScroll);
    },
  };
}

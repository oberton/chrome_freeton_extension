const port = chrome.extension.connect({
  name: 'eventBus',
});

export default port;

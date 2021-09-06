const port = chrome && chrome.extension ? chrome.extension.connect({
  name: 'eventBus',
}) : {};

export default port;

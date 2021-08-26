// FIXME make this script very thin, avoid webpack define things

import eventBus from 'js/utils/utils/eventBus';
import './pinKeeper';

let popupParams;
let lastTabId;

function onPopupReady() {
  if (popupParams) {
    eventBus.trigger('oberton-api-call', {...popupParams, tabId: lastTabId});
    popupParams = null;
  }
}

function onExtensionResponse(params) {
  chrome.runtime.sendMessage(params);

  chrome.tabs.query({active: true}, (tabs) => {
    _.each(tabs, t => {
      if (t.id === lastTabId) {
        chrome.tabs.sendMessage(t.id, params);
      }
    });
  });
}

function onReady(port) {

  eventBus.trigger('popup-connected', true, port);

  eventBus.__events['oberton-extension-response'] = [];
  eventBus.__events['popup-ready'] = [];

  eventBus
    .on('oberton-extension-response', onExtensionResponse)
    .on('popup-ready', onPopupReady);

  port.onMessage.addListener((msg) => {
    if (msg.type === 'eventBus') {
      eventBus.notify(msg.eventName, msg.value);
    }
  });
}

if (NODE_ENV !== 'production') {
  window.eventBus = eventBus;
}

function openPopup(params) {
  chrome.windows.getLastFocused((windowObject) => {

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      lastTabId = _.get(tabs, '0.id');
    });

    const position = {
      x: Math.max(windowObject.top + (windowObject.width - 360), 0),
      y: Math.max(windowObject.top, 80),
    };

    popupParams = params;

    eventBus.trigger('close-popup', true);

    chrome.windows.create({
      url: 'html/popup.html',
      type: 'popup',
      width: 360,
      height: 510,
      left: position.x,
      top: position.y,
      focused: true,
    });
  });
}

chrome.runtime.onMessage.addListener((request) => {
  openPopup(request);
});

chrome.extension.onConnect.addListener(onReady);

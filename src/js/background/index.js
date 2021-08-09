// FIXME make this script very thin, avoid webpack define things

import eventBus from 'js/utils/utils/eventBus';
import './pinKeeper';

let popupParams;

function onPopupReady() {
  if (popupParams) {
    eventBus.trigger('oberton-api-call', popupParams);
    popupParams = null;
  }
}

function onReady(port) {

  eventBus.trigger('popup-connected', true, port);
  eventBus.on('popup-ready', onPopupReady);

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

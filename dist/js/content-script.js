/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
let apiId = null;
let eventOn = false;

function onCallObertonFunction(e) {
  apiId = e.detail.apiId;
  const event = new CustomEvent('@oberton/extensionResponse', {
    detail: {
      appId: e.detail.apiId,
      subject: 'extensionExists',
      value: true
    }
  });
  chrome.runtime.sendMessage(e.detail);
  window.dispatchEvent(event);
}

chrome.runtime.onMessage.addListener(data => {
  if (data.apiId === apiId) {
    const event = new CustomEvent('@oberton/extensionResponse', {
      detail: {
        appId: apiId,
        subject: data.subject,
        value: data.value
      }
    });
    window.dispatchEvent(event);
  }
});

if (!eventOn) {
  window.addEventListener('@oberton/callObertonFunction', onCallObertonFunction);
  eventOn = true;
}
/******/ })()
;
//# sourceMappingURL=content-script.js.map
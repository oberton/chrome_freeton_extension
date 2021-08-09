/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
function onCallObertonFunction(e) {
  /* params contain:
   *  function name
   *  network
   *  function params
   */
  const event = new CustomEvent('@oberton/extensionResponse', {
    detail: {
      subject: 'extensionExists',
      value: true
    }
  });
  chrome.runtime.sendMessage(e.detail);
  window.dispatchEvent(event);
  /* send a message over some bridge, to the background script,
   * backgrround script receives the message and does its job
   *
   * in background script we listen when popup is open, and once it's opened, we call with the message
   * popup reacts to that and opens the related dialog
   *
   * once tokens are sent, notify SDK[
   *  -> popup calls background -> background calls content script -> content script response -> close popup -> notify SDK
   * ]
   *
   *
   * sendToken[to, amount, comment{all types}}
   * make last active wallet sent from active in the next session
   *
   * buy domain, and build API docs
   */

  console.log(chrome.runtime);
}

console.log('READY!');
window.addEventListener('@oberton/callObertonFunction', onCallObertonFunction);
/******/ })()
;
//# sourceMappingURL=content-script.js.map
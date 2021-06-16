function ready() {
}

window.setInterval(function() {
  console.log('Hello, world!'); 
}, 1000 * 60 * 3);

chrome.alarms.create('refresh', { periodInMinutes: 3 });

chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled....');
});

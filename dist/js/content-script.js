/*! For license information please see content-script.js.LICENSE.txt */
(()=>{let e=null,n=!1;chrome.runtime.onMessage.addListener((n=>{if(n.apiId===e){const t=new CustomEvent("@oberton/extensionResponse",{detail:{appId:e,subject:n.subject,value:n.value}});window.dispatchEvent(t)}})),n||(window.addEventListener("@oberton/callObertonFunction",(function(n){e=n.detail.apiId;const t=new CustomEvent("@oberton/extensionResponse",{detail:{appId:n.detail.apiId,subject:"extensionExists",value:!0}});chrome.runtime.sendMessage(n.detail),window.dispatchEvent(t)})),n=!0)})();
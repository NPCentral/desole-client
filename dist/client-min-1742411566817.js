(()=>{var e={45:e=>{e.exports=function(){"use strict";return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(e){var t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)}))}},224:(e,t,n)=>{var r=n(45);function o(e){"use strict";this.url=e.url,this.tags=e.tags||{},this.ignore=e.ignore||[],this.modules=e.modules||["onerror","console","unhandledrejection"],this.app={name:e.app&&e.app.name||n.g&&n.g.location&&n.g.location.hostname,version:e.app&&e.app.version||!1,stage:e.app&&e.app.stage||!1},e.manualInit||this.attach()}o.isErrorObject=function(e){"use strict";var t={}.toString.apply(e);return"[object Object]"===t||"[object Error]"===t},o.prototype.attach=function(){"use strict";var e=this;e.modules.indexOf("onerror")>-1&&(e._originalOnError=n.g&&n.g.onerror,n.g.onerror=function(t,r,i,a,s){var c=o.isErrorObject(s);e.track({severity:"error",stack:c&&s.stack||String(s),type:c&&s.name||"",message:t||String(s)}),e._originalOnError&&e._originalOnError(n.g,[t,r,i,a,s])}),e.modules.indexOf("console")>-1&&(e._originalConsoleError=console&&console.error,console.error=function(){var t,n=Array.prototype.slice.call(arguments);function r(e){try{return"object"==typeof e?JSON.stringify(e):String(e)}catch(e){}return String(e)}t=n.map(r),e.track({severity:"info",stack:t.join(", "),type:"ConsoleError",message:n.length&&n[0]&&r(n[0].message)||n.join(", ")}),e._originalConsoleError.apply(this,arguments)}),e.modules.indexOf("unhandledrejection")>-1&&(e._originalUnhandledRejection=n.g.onunhandledrejection,n.g.onunhandledrejection=function(t){e.track({severity:"warning",stack:"",type:t.type||"UnhandledPromiseRejection",message:t.reason}),e._originalUnhandledRejection&&e._originalUnhandledRejection.apply(this,arguments)})},o.prototype.detach=function(){"use strict";this.modules.indexOf("onerror")>-1&&(n.g.onerror=this._originalOnError),this.modules.indexOf("console")>-1&&(console.error=this._originalConsoleError),this.modules.indexOf("unhandledrejection")>-1&&(n.g.onunhandledrejection=this._originalUnhandledRejection)},o.prototype.track=function(e){"use strict";var t="unknown error",o=new n.g.XMLHttpRequest,i=this.url,a={severity:e.severity,type:e.type,message:e.message,timestamp:e.timestamp||Date.now(),resource:e.resource||n.g&&n.g.location&&n.g.location.href,app:{name:e.app&&e.app.name||this.app.name,version:e.app&&e.app.version||this.app.version,stage:e.app&&e.app.stage||this.app.stage},endpoint:{id:e.endpoint&&e.endpoint.id||r(),language:e.endpoint&&e.endpoint.language||n.g.navigator&&n.g.navigator.language,platform:e.endpoint&&e.endpoint.platform||n.g.navigator&&n.g.navigator.platform},tags:e.tags||this.tags};if(!e.message||!/Object Not Found Matching Id/i.test(e.message)){if(a.stack=e.stack,"string"!=typeof a.stack)try{a.stack=JSON.stringify(a.stack)}catch(e){console.log("Stack trace conversion to string failed",e);try{t=JSON.stringify(e)}catch(e){}a.stack="Stack trace conversion to string failed: "+t}o.open("POST",i,!0),o.setRequestHeader("Content-type","application/json"),o.send(JSON.stringify(a))}},o.prototype.captureException=function(e){"use strict";return this.track({severity:"error",stack:e.stack,type:e.name,message:e.message})},e.exports=o}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r](i,i.exports,n),i.exports}n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}();var r=n(224);window.Desole=r})();
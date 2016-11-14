var hyperdom = require('hyperdom');
var runningInBrowser = !require('is-node');
var createBrowser = require('browser-monkey/create');
var vquery = require('vdom-query');
var window = require('global');
var document = window.document;

function addRefreshButton() {
  var refreshLink = document.createElement('a');
  refreshLink.href = window.location.href;
  refreshLink.innerText = 'refresh';
  document.body.appendChild(refreshLink);
  document.body.appendChild(document.createElement('hr'));
}

var div;
function createTestDiv() {
  if (div) {
    div.parentNode.removeChild(div);
  }
  div = document.createElement('div');
  document.body.appendChild(div);
  return div;
}

if (runningInBrowser) {
  if (/\/debug\.html$/.test(window.location.pathname)) {
    localStorage['debug'] = 'browser-monkey';
    addRefreshButton();
  }
} else {
  require('./stubBrowser');
}

module.exports = function(app) {
  var browser;

  if (runningInBrowser) {
    browser = createBrowser(document.body);
    hyperdom.append(createTestDiv(), app);
  } else {
    var vdom = hyperdom.html('body');

    browser = createBrowser(vdom);
    browser.set({$: vquery, visibleOnly: false, document: {}});

    hyperdom.appendVDom(vdom, app, { requestRender: setTimeout, window: window });
  }
  return browser;
}

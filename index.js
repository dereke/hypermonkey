var hyperdom = require('hyperdom');
var runningInBrowser = !require('is-node');
var createBrowser = require('browser-monkey/create');
var vquery = require('vdom-query');
var VineHill = require('vinehill');
var router = require('hyperdom-router');
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

function HyperMonkey() {
  this.vinehill = new VineHill();
}

HyperMonkey.prototype.setOrigin = function(host) {
  this.vinehill.setOrigin(host);
  return this;
}

HyperMonkey.prototype.withServer = function(host, app) {
  this.vinehill.add(host, app);

  return this;
}

HyperMonkey.prototype.withApp = function(getApp) {
  this.getApp = getApp;
  return this;
}

HyperMonkey.prototype.start = function() {
  router.start();
  this.vinehill.start();
  var app = this.getApp(router);
  this.app = app;

  if (runningInBrowser) {
    this.browser = createBrowser(document.body);
    hyperdom.append(createTestDiv(), app);
  } else {
    var vdom = hyperdom.html('body');

    this.browser = createBrowser(vdom);
    this.browser.set({$: vquery, visibleOnly: false, document: {}});

    hyperdom.appendVDom(vdom, app, { requestRender: setTimeout, window: window });
  }
  return this;
}

HyperMonkey.prototype.stop = function(){
  router.clear();
  this.vinehill.stop();
}

module.exports = function() {
  return new HyperMonkey();
}

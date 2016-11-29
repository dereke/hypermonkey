/** @jsx hyperdom.jsx */

// --------- your express app ---------
var expressApp = (require('express'))();
expressApp.get('/api/frameworks', (req, res) => {
  res.json([
    'browser-monkey',
    'hyperdom',
    'vinehill',
  ]);
});

// --------- your hyperdom app ---------
var httpism = require('httpism/browser');
var hyperdom = require('hyperdom');
var html = hyperdom.html;

class WebApp {
  constructor() {
    var self = this;
    this.model = {
      frameworks: []
    };

    httpism.get('/api/frameworks').then(response => {
      self.model.frameworks = response.body;
      self.model.refresh();
    });
  }


  render() {
    this.model.refresh = html.refresh;

    return <ul>
      {this.model.frameworks.map(name => <li>{name}</li>)}
    </ul>
  }
}


// --------- your tests ---------
var hypermonkey = require('.');
var expect = require('chai').expect

describe('my awesome app', () => {
  var monkey, app;

  beforeEach(() => {
    monkey = hypermonkey()
      .withServer('http://localhost:1234', expressApp)
      .withApp(() => {
        app = new WebApp();
        return app;
      })
      .start();
  });

  afterEach(() => monkey.stop());

  it('loads some data', () => {
    return monkey.browser.find('li').shouldHave({text: [
      'browser-monkey',
      'hyperdom',
      'vinehill',
    ]})
  });

  it('exposes the app', () => {
    expect(monkey.app).to.equal(app);
  });
});

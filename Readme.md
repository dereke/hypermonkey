# Hyper Monkey
Test your hyperdom apps using browser-monkey and vinehill with just a few lines of code

# Get started

```
/** @jsx hyperdom.jsx */
var window = require('global');

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
var hypermonkey = require('hypermonkey');

describe('my awesome app', () => {
  var monkey;

  beforeEach(() => {
    monkey = hypermonkey()
      .withServer('http://localhost:1234', expressApp)
      .withApp(() => new WebApp())
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
});
```

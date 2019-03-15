import React from 'react';
import ReactDOM from 'react-dom';

import App from './containers/App';

if (process.env.NODE_ENV === 'production') {
  // TODO: remove hacky hack https://github.com/parcel-bundler/parcel/issues/2080
  const x = 'sw.js';
  navigator.serviceWorker.register(x);
}

var container = document.getElementById('app');

ReactDOM.render(<App />, container);

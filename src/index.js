import React from 'react';
import ReactDOM from 'react-dom';
import Amplify from 'aws-amplify';

import awsmobile from './aws-exports';
import App from './App';
import * as serviceWorker from './serviceWorker';

const rootEl = document.getElementById('root');

Amplify.configure(awsmobile);

let render = Component => {
  ReactDOM.render(<App />, rootEl);
};

render(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    render(NextApp);
  });
}

serviceWorker.unregister();

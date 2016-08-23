import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import ReduxPromise from 'redux-promise';

import App from './components/App';

const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);

document.addEventListener('DOMContentLoaded', function () {
  ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
});

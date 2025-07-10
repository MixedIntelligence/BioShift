import React from 'react';
import { createRoot } from 'react-dom/client';
import {routerMiddleware} from 'connected-react-router';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux'
import ReduxThunk from 'redux-thunk'
import * as serviceWorker from './serviceWorker';
import axios from 'axios';

import App from './components/App';
import config from './config';
import createRootReducer from './reducers';

import {doInit} from './actions/auth';
import {createHashHistory} from 'history';

const history = createHashHistory();

export function getHistory() {
  return history;
}

axios.defaults.baseURL = config.baseURLApi;
axios.defaults.headers.common['Content-Type'] = "application/json";
const token = localStorage.getItem('token');
if (token) {
    axios.defaults.headers.common['Authorization'] = "Bearer " + token;
}

export const store = createStore(
  createRootReducer(history),
  compose(
    applyMiddleware(
      routerMiddleware(history),
      ReduxThunk
    ),
  )
);

const renderApp = () => {
  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
};

// Wrap the initialization in an async function to wait for completion
const initializeApp = async () => {
  try {
    await store.dispatch(doInit());
    renderApp();
  } catch (error) {
    console.error('Error during app initialization:', error);
    // Optionally render an error state
    renderApp();
  }
};

initializeApp();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

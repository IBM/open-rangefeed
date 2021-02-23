import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import Login from './login/login';
import ViewSwitcher from './content/viewswitcher';
import 'sanitize.css';
import './global.css';
import dbconfig from './dbconfig';
import store from 'react-couchdb-store/store';

const dbHostResult = dbconfig.getDbHost();
let host = dbHostResult.host;
const port = dbHostResult.port;
const dbName = dbHostResult.dbname;
const protocol = dbHostResult.protocol;
const localPrefix = 'main-';
const bidirectional = dbHostResult.bidirectional;

if (!host) console.error('No host for db defined, check hostConfig in index.js!');
else console.log(`Using db host ${host}`);

const onLoginAttempt = (username, password) => {
  const useSSL = protocol === 'https';

  // Try to connect
  return store.init(host, port, dbName, username, password, useSSL, true, localPrefix, bidirectional).on('complete', () => {
    store.close(); // Close test connection (with live option)
    store.init(host, port, dbName, username, password, useSSL, false, localPrefix, bidirectional); // Re-open connection without live option
    ReactDOM.render(<ViewSwitcher />, document.getElementById('root'));
  });
};

ReactDOM.render(<Login onLoginAttempt={onLoginAttempt} />, document.getElementById('root'));

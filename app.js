'use strict';

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const routes = require('./config/routes');
const bodyParser = require('body-parser');
const device = require('express-device');

const App = function (options) {
  let app = express();
  app.use((req, res, next) => {
    next();
  });
  if (!options.quiet) {
    app.use(morgan('dev'));
  }
  app.use(device.capture());
  app.use(bodyParser.json());
  app.use(express.static('public'));

  app.use(routes);
  app.use('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
  });

  return app;
};

module.exports = App;

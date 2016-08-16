'use strict';

const express = require('express');
const morgan = require('morgan');
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
  app.use(routes);
  return app;
};

module.exports = App;

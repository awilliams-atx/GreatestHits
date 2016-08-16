'use strict';

const express = require('express');
const morgan = require('morgan');
const routes = require('./config/routes');
const bodyParser = require('body-parser');

const App = function (options) {
  let app = express();
  if (!options.quiet) {
    app.use(morgan('dev'));
  }
  app.use(bodyParser.json());
  app.use(routes);
  return app;
};

module.exports = App;

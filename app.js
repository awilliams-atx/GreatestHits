'use strict';

const bodyParser = require('body-parser');
const device = require('express-device');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const routes = require('./config/routes');
const sassMiddleware = require('node-sass-middleware');

const App = function (options) {
  let app = express();
  app.use((req, res, next) => {
    next();
  });
  if (!options.quiet) { app.use(morgan('dev')) }
  app.use(device.capture());
  app.use(bodyParser.json());

  app.use(sassMiddleware({
    src: __dirname + '/sass',
    dest: __dirname + '/public/stylesheets',
    prefix: '/stylesheets'
  }));
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(routes);
  app.use('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
  });

  return app;
};

module.exports = App;

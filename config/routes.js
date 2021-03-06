'use strict';

const router = require('express').Router();
const RedirectsController = require('../controllers/redirects_controller');
const UrlsController = require('../controllers/urls_controller');

router.get('/api/urls', (req, res) => {
  new UrlsController(req, res).index();
});

router.get('/api/url/:id', (req, res) => {
  new UrlsController(req, res).show();
});

router.post('/api/urls', (req, res) => {
  new UrlsController(req, res).create();
});

router.get('*', (req, res, next) => {
  new RedirectsController(req, res, next).redirect();
});

module.exports = router;

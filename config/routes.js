'use strict';

const router = require('express').Router();
const RedirectsController = require('../controllers/redirects_controller');
const UrlsController = require('../controllers/urls_controller');

router.get('/urls', (req, res) => {
  new UrlsController(req, res).index();
});

router.get('/url/:id', (req, res) => {
  new UrlsController(req, res).show();
});

router.post('/urls', (req, res) => {
  new UrlsController(req, res).create();
});

router.get('*', (req, res) => {
  new RedirectsController(req, res).redirect();
})

module.exports = router;

'use strict';

const router = require('express').Router();
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

module.exports = router;

'use strict';

const router = require('express').Router();
const UrlsController = require('../controllers/urls_controller');

router.get('/urls', (req, res, next) => {
  new UrlsController(req, res, next).index();
});

router.get('/url/:id', (req, res, next) => {
  new UrlsController(req, res, next).show();
});

module.exports = router;

'use strict';
const Url = require('../models/url.js');
const ApplicationController = require('./application_controller');

class UrlsController extends ApplicationController {
  constructor (req, res) {
    super();
    this.req = req;
    this.res = res;
  }

  index () {
    Url.all()
      .then(urls => {
        this.res.json(urls).status(200);
      }).catch(err => {
        console.error(err);
        this.res.send(500);
      });
  }

  show () {
    Url.find(this.urlParams().id, { quiet: this.miscParams().quiet })
      .then(url => {
        if (url === null) {
          this.res.status(404).send('Url not found');
        } else {
          this.res.json(url).status(200);
        }
      })
      .catch(err => {
        console.error(err);
        this.res.sendStatus(500);
      });
  }

  create () {
    Url.availableRandomString()
      .then(str => {
        return Url.insert({
          attributes: this.urlParams({short: '/' + str}),
          done: false,
          quiet: this.miscParams().quiet
        });
      }).then(op => {
        Object.assign(op, {done: true});
        return Url.find(op.id, op);
      }).then(url => {
        this.res.status(200).json(url);
      }).catch(err => {
        console.error(err);
        this.res.sendStatus(500);
      });
  }

  urlParams (merge) {
    return this.params(['desktop', 'id', 'mobile', 'tablet', 'desktopHits', 'mobileHits', 'tabletHits', 'desktopRedirects', 'mobileRedirects', 'tabletRedirects'], merge);
  }

  miscParams () {
    return this.params(['quiet']);
  }
}

module.exports = UrlsController;

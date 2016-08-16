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
    Url.all({
      tableName: 'urls',
      Constructor: Url,
      done: true
    }).then((urls) => {
      this.res.json(urls).status(200);
    }).catch(err => {
      console.error(err);
      this.res.send(500);
    });
  }

  show () {
    Url.find({
      tableName: 'urls',
      Constructor: Url,
      id: this.urlParams().id
    }).then(url => {
      if (url === null) {
        this.res.status(404).send('Url not found');
      } else {
        this.res.json(url).status(200);
      }
    }).catch(err => {
      console.error(err);
      this.res.sendStatus(500);
    });
  }

  create () {
    Url.AvailableRandomString()
      .then(str => {
        return Url.insert({
          attributes: this.urlParams({short: str}), tableName: 'urls',
            done: false,
        });
      }).then((op) => {
        return Url.find(Object.assign(op, {
          tableName: 'urls', Constructor: Url, id: op.id, done: true
        }));
      }).then(url => {
        this.res.status(200).json(url);
      }).catch(err => {
        console.error(err);
        this.res.sendStatus(500);
      });
  }

  urlParams (merge) {
    return this.params(['desktop', 'id', 'mobile', 'tablet'], merge);
  }
}

module.exports = UrlsController;

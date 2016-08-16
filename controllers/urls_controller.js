'use strict';
const Url = require('../models/url.js');

class UrlsController {
  constructor (req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
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
      this.res.send(500);
    });
  }

  urlParams () {
    let incomingParams = Object.assign({}, this.req.params, this.req.query);
    let req = this.req;
    let whiteList = {desktop: true, mobile: true, tablet: true, id: true};
    let params = {};
    Object.keys(incomingParams).forEach(key => {
      if (whiteList[key]) {
        params[key] = incomingParams[key];
      }
    });
    return params;
  }
}

module.exports = UrlsController;

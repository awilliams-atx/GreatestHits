'use strict';
const Url = require('../models/url.js');

class UrlsController {
  constructor (req, res) {
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
    let params = this.urlParams();
    Url.AvailableRandomString()
      .then(str => {
        return Url.insert({
          attributes: {
            short: str,
            desktop: params.desktop ? params.desktop : null,
            mobile: params.mobile ? params.mobile : null,
            tablet: params.tablet ? params.tablet : null
          },
          tableName: 'urls', done: false,
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

  urlParams () {
    let incomingParams = Object.assign({}, this.req.params, this.req.query, this.req.body);
    let whiteList = {desktop: true, id: true, mobile: true, tablet: true, };
    let params = {};
    Object.keys(incomingParams).forEach(key => {
      if (whiteList[key]) { params[key] = incomingParams[key]; }
    });
    return params;
  }
}

module.exports = UrlsController;

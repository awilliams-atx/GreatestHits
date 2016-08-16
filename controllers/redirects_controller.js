'use strict';

const ApplicationController = require('./application_controller');
const nodeUrl = require('url');
const Url = require('../models/url.js');
// const MobileDetect = requirxe('mobile-detect');

class RedirectsController extends ApplicationController {
  constructor(req, res, next) {
    super();
    this.req = req;
    this.res = res;
  }

  redirect () {
    let path = nodeUrl.parse(this.req.url).pathname;
    let device = this.req.device.type;
    device = (device === 'phone') ? 'mobile' : device;
    Url.where({
      Constructor: Url, tableName: 'urls', where: { short: path }
    }).then(urls => {
      if (urls.length === 0) {
        this.res.sendStatus(404);
      } else {
        let url = urls[0];
        if (url.attributes[device]) {
          this.res.redirect(url.attributes[device]);
        } else if (url.attributes['desktop']){
          this.res.redirect(url.attributes['desktop']);
        } else {
          this.res.sendStatus(404);
        }
      }
    }).catch(err => {
      console.error(err);
      this.res.sendStatus(500);
    });
  }
}

module.exports = RedirectsController;

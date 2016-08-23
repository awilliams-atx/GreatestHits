'use strict';

const ApplicationController = require('./application_controller');
const nodeUrl = require('url');
const QueryHelper = require('../lib/QueryHelper');
const Url = require('../models/url.js');
// const MobileDetect = requirxe('mobile-detect');

class RedirectsController extends ApplicationController {
  constructor(req, res, next) {
    super();
    this.req = req;
    this.res = res;
    this.next = next;
    this.path = nodeUrl.parse(this.req.url).pathname;
  }

  static checkPhoneString (str) {
    return (str === 'phone') ? 'mobile' : str
  }

  hit (url, deviceHits, redirects) {
    let setOptions = {};
    setOptions[deviceHits] = deviceHits + ' + 1';
    setOptions[redirects] = redirects + ' + 1';
    Url.update({
      blockToString: { desktopHits: true, mobileHits: true, tabletHits: true, desktopRedirects: true, mobileRedirects: true, tabletRedirects: true },
      set: setOptions,
      where: { id: url.attributes.id },
      done: false,
      quiet: this.miscParams().quiet
    }).then(op => {
      return Url.find(op.id, QueryHelper.toFind
        (Object.assign(op, {done: true, Constructor: Url})));
    }).catch(err => {
      console.error(err);
    });
  }

  redirect () {
    if (this.path === '/') { return this.next(); }
    let device = RedirectsController.checkPhoneString(this.req.device.type);
    Url.where({ where: { short: this.path }, quiet: this.miscParams().quiet })
      .then(urls => {
        if (urls.length > 0) {
          this.processRedirect(urls[0], device);
        } else {
          this.res.sendStatus(404);
        }
      }).catch(err => {
        console.error(err);
        this.res.sendStatus(500);
      });
  }

  // PRIVATE

  miscParams () {
    return this.params(['quiet']);
  }

  processRedirect (url, device) {
    let redirects;
    if (url.attributes[device]) {
      redirects = device + 'Redirects';
      this.res.redirect(url.attributes[device]);
    } else if (url.attributes['desktop']){
      redirects = 'desktopRedirects';
      this.res.redirect(url.attributes['desktop']);
    } else {
      this.res.sendStatus(404);
    }
    this.hit(url, `${device}Hits`, redirects);
  }
}

module.exports = RedirectsController;

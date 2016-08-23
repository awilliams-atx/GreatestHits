'use strict';

class ApplicationController {
  constructor (req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next || null;
  }

  params (whiteList, merge) {
    if (merge === undefined) { merge = {}; }
    let setWhiteList = {};
    whiteList.forEach(item => { setWhiteList[item] = true });
    let incomingParams = Object.assign({}, this.req.params, this.req.query, this.req.body);
    let params = {};
    Object.keys(incomingParams).forEach(key => {
      if (setWhiteList[key]) { params[key] = incomingParams[key]; }
    });
    return Object.assign(params, merge);
  }
}

module.exports = ApplicationController;

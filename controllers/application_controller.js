'use strict';

class ApplicationController {
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

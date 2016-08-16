'use strict';

class ApplicationController {
  params (whiteList, merge) {
    let setWhiteList = {};
    whiteList.forEach(item => { setWhiteList[item] = true });
    let incomingParams = Object.assign({}, this.req.params, this.req.query, this.req.body);
    let params = {};
    Object.keys(incomingParams).forEach(key => {
      if (setWhiteList[key]) { params[key] = incomingParams[key]; }
    });
    return merge ? Object.assign(params, merge) : params;
  }
}

module.exports = ApplicationController;

'use strict';

const request = require('supertest'),
      chai = require('chai'),
      expect = chai.expect,
      mockery = require('mockery'),
      Util = require('./Util.js');

describe('routes', () => {
  var mockUrl = (mock) => {
    mockery.enable({
      warnOnUnregistered: false,
      warnOnReplace: false,
      useCleanCache: true
    });
    mockery.registerMock('../models/url.js', mock);
  };
  describe('GET /url/:id', () => {
    describe('url not found', () => {
      let app, server;
      before(() => {
        mockUrl({ find: () => { return new Promise(res => res(null)) } });
        app = require('../app')({quiet: true});
        server = app.listen(3000);
      });
      after(() => {
        mockery.disable();
        server.close();
      });
      it('responds 404', (done) => {
        request(app)
          .get('/url/49')
          .expect(404, done);
      });
    });
    describe('url found', () => {
      let urlMock, app, server;
      before(() => {
        mockUrl({ find: () => { return new Promise(res => res({})) } });
        app = require('../app')({quiet: true});
        server = app.listen(3000);
      });
      after(() => {
        mockery.disable();
        server.close();
      });
      it('responds with url', (done) => {
        request(app)
          .get('/url/87')
          .expect(200, {}, done);
      });
    });
  });
});

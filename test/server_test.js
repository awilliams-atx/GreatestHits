'use strict';

const request = require('supertest'),
      chai = require('chai'),
      expect = chai.expect,
      Util = require('./Util.js');

describe('routes', () => {
  describe('GET /url/:id', () => {
    describe('url not found', () => {
      let app, server;
      before(() => {
        Util.mockUrl({ find: () => { return new Promise(res => res(null)) } });
        app = require('../app')({quiet: true});
        server = app.listen(3000);
      });
      after(() => {
        Util.disableMockery();
        server.close();
      });
      it('responds 404', (done) => {
        request(app)
          .get('/url/49')
          .expect(404, done);
      });
    });
    describe('url found', () => {
      let app, server;
      before(() => {
        Util.mockUrl({ find: () => { return new Promise(res => res({})) } });
        app = require('../app')({quiet: true});
        server = app.listen(3000);
      });
      after(() => {
        Util.disableMockery();
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

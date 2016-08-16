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
  describe('GET /urls', () => {
    let app, server;
    before(done => {
      Util.mockUrl({ all: () => { return new Promise(res => res([{},{}])) } });
      app = require('../app')({quiet: true});
      server = app.listen(3000);
      done();
    });
    after(() => {
      Util.disableMockery();
      server.close();
    });
    it('returns all urls', (done) => {
      request(app)
      .get('/urls')
      .expect(200)
      .expect(res => {
        expect(res.body).to.be.instanceof(Array).with.length(2)
      })
      .end(done);
    });
  });
  describe('POST /urls', () => {
    let app, server, mockAvailStr, mockFind, mockInsert;
    before(done => {
      var mockFind = function () {
        return new Promise(res => res({}));
      }
      Util.mockUrl({
        AvailableRandomString: () => {
          return new Promise(res => res('MockRandomString'));
        },
        find: () => { return new Promise(res => res('MockUrl')); },
        insert: () => { return new Promise(res => res('MockInsertOpts')) }
      });
      app = require('../app')({quiet: true});
      server = app.listen(3000);
      Util.dropAndCreateTableUrls(() => {
        done();
      });
    });
    after((done) => {
      Util.disableMockery();
      server.close();
      Util.dropTableUrls(() => {
        done();
      });
    });
    it('calls Url::find', (done) => {
      request(app)
        .post('/urls')
        .send({'short': ''})
        .expect(200)
        .expect(res => {
          expect(res.body).to.equal('MockUrl');
        })
        .end(done);
    });
  });
});

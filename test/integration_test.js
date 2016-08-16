'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const request = require('supertest');
const Util = require('./Util');
const Url = require('../models/url');

describe('integration', () => {
  let app, server;
  describe('POST /urls', () => {
    before((done) => {
      app = require('../app')({quiet: true});
      server = app.listen(3000);
      Util.dropAndCreateTableUrls(() => {
        done();
      });
    });
    after(done => {
      server.close();
      Util.dropTableUrls(() => {
        done();
      });
    });
    it('responds JSON with initialized url', (done) => {
      request(app)
        .post('/urls')
        .send({desktop: 'http://www.officemax.com/', quiet: true})
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).to.have.deep
            .property('attributes.desktop', 'http://www.officemax.com/');
          expect(res.body).to.have.deep
            .property('attributes.desktopHits', 0);
          expect(res.body).to.have.deep
            .property('attributes.mobileRedirects', 0);
        })
        .end(done);
    });
  });
  describe('GET /url/:id', () => {
    before(done => {
      app = require('../app')({quiet: true});
      server = app.listen(3000);
      Util.dropAndCreateTableUrls(() => {
        Util.insertYahoo(() => {
          Util.insertGoogle(() => {
            Util.insertYahoo(() => {
              done();
            });
          });
        });
      });
    });
    after(done => {
      server.close();
      Util.dropTableUrls(() => {
        done();
      });
    });
    it('retrieves a URL from the database', (done) => {
      request(app)
        .get('/url/2')
        .send({quiet: true})
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.deep.property('attributes.id', 2);
          expect(res.body).to.have.deep
            .property('attributes.')
        })
        .end(done);
    });
  });
});

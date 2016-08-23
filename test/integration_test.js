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
  describe('POST /api/urls', () => {
    before(done => {
      app = require('../app')({ quiet: true });
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
        .post('/api/urls')
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
  describe('GET /api/urls', () => {
    before(done => {
      app = require('../app')({quiet: true});
      server = app.listen(3000);
      Util.dropAndCreateTableUrls(() => {
        Util.insertGoogle(() => {
          Util.insertYahoo(() => {
            done();
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
    it('retrieves all URLS from database', (done) => {
      request(app)
        .get('/api/urls')
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.length(2);
          expect(res.body[0]).to.have.deep.property('attributes.mobileHits', 0);
          expect(res.body[1]).to.have.deep
            .property('attributes.desktop', 'http://www.yahoo.com/');
        })
        .end(done);
    });
  });
  describe('GET /api/url/:id', () => {
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
        .get('/api/url/2')
        .send({quiet: true})
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.deep.property('attributes.id', 2);
          expect(res.body).to.have.deep
            .property('attributes.');
        })
        .end(done);
    });
  });
  describe('GET /* (redirecting)', () => {
    beforeEach(done => {
      app = require('../app')({quiet: true});
      server = app.listen(3000);
      Util.enableMockery();
      Util.mockExpressDevice('phone');
      Util.dropAndCreateTableUrls(() => {
        Util.insertGoogle(() => {
          Util.insertYahoo(() => {
            done();
          });
        });
      });
    });
    afterEach(done => {
      server.close();
      Util.disableMockery();
      Util.dropTableUrls(() => {
        done();
      });
    });
    it('responds 302', (done) => {
      let yahooShort;
      request(app)
        .get('/api/url/2')
        .send({quiet: true})
        .expect(res => {
          yahooShort = res.body.attributes.short;
          expect(res.body.attributes.id).to.equal(2);
          expect(res.body.attributes.desktop).to.equal('http://www.yahoo.com/');
        })
        .end(() => {
          request(app)
            .get(yahooShort)
            .send({quiet: true})
            .expect(302)
            .expect(res => {
              expect(res.headers.location).to
                .equal('http://www.yahoo.com/mobile/');
            })
            .end(done);
        });
    });
    it('updates hit and redirect counts', (done) => {
      let yahooShort;
      request(app)
        .get('/api/url/2')
        .send({quiet: true})
        .expect(res => {
          yahooShort = res.body.attributes.short;
          expect(res.body.attributes.id).to.equal(2);
          expect(res.body.attributes.desktop).to.equal('http://www.yahoo.com/');
        })
        .end(() => {
          request(app)
            .get(yahooShort)
            .send({quiet: true})
            .expect(302)
            .expect(res => {
              expect(res.headers.location).to
                .equal('http://www.yahoo.com/mobile/');
            })
            .end(() => {
              request(app)
                .get('/api/url/2')
                .send({quiet: true})
                .expect(res => {
                  expect(res.body.attributes.mobileHits).to.equal(1);
                  expect(res.body.attributes.mobileRedirects).to.equal(1);
                  expect(res.body.attributes.desktopHits).to.equal(0);
                })
                .end(done);
            });
        });
    });
  });
});

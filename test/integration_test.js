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
  describe('GET /urls', () => {
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
        .get('/urls')
        .expect(200)
        .expect(res => {
          res.body.should.have.length(2);
          res.body[0].should.have.deep.property('attributes.mobileHits', 0);
          res.body[1].should.have.deep
            .property('attributes.desktop', 'http://www.yahoo.com/');
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
        .get('/url/2')
        .send({quiet: true})
        .expect(res => {
          yahooShort = res.body.attributes.short;
          res.body.attributes.id.should.equal(2);
          res.body.attributes.desktop.should.equal('http://www.yahoo.com/');
        })
        .end(() => {
          request(app)
            .get(yahooShort)
            .send({quiet: true})
            .expect(302)
            .expect(res => {
              res.headers.location.should
                .equal('http://www.yahoo.com/mobile/');
            })
            .end(done);
        });
    });
    it('updates hit and redirect counts', (done) => {
      let yahooShort;
      request(app)
        .get('/url/2')
        .send({quiet: true})
        .expect(res => {
          yahooShort = res.body.attributes.short;
          res.body.attributes.id.should.equal(2);
          res.body.attributes.desktop.should.equal('http://www.yahoo.com/');
        })
        .end(() => {
          request(app)
            .get(yahooShort)
            .send({quiet: true})
            .expect(302)
            .expect(res => {
              res.headers.location.should
                .equal('http://www.yahoo.com/mobile/');
            })
            .end(() => {
              request(app)
                .get('/url/2')
                .send({quiet: true})
                .expect(res => {
                  res.body.attributes.mobileHits.should.equal(1);
                  res.body.attributes.mobileRedirects.should.equal(1);
                  res.body.attributes.desktopHits.should.equal(0);
                })
                .end(done);
            });
        });
    });
  });
});

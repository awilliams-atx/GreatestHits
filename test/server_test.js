'use strict';

const request = require('supertest'),
      chai = require('chai'),
      expect = chai.expect,
      Util = require('./Util.js'),
      app = require('../app')({quiet: true});

describe('routes', () => {
  let app;
  describe('GET /url/:id', () => {
    describe('url not found', () => {
      before(() => {
        Util.enableMockery();
        Util.mockUrl({ find: () => { return new Promise(res => res(null)) } });
        app = require('../app')({quiet: true});
      });
      after(() => {
        Util.disableMockery();
      });
      it('responds 404', (done) => {
        request(app)
          .get('/url/49')
          .expect(404, done);
      });
    });
    describe('url found', () => {
      before(() => {
        Util.enableMockery();
        Util.mockUrl({ find: () => { return new Promise(res => res({})) } });
        app = require('../app')({quiet: true});
      });
      after(() => {
        Util.disableMockery();
      });
      it('responds with url', (done) => {
        request(app)
          .get('/url/87')
          .expect(200, {}, done);
      });
    });
  });
  describe('GET /urls', () => {
    before(done => {
      Util.enableMockery();
      Util.mockUrl({ all: () => { return new Promise(res => res([{},{}])) } });
      app = require('../app')({quiet: true});
      done();
    });
    after(() => {
      Util.disableMockery();
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
    before(done => {
      Util.enableMockery();
      Util.mockUrl({
        AvailableRandomString: () => {
          return new Promise(res => res('MockRandomString'));
        },
        find: () => { return new Promise(res => res('MockUrl')); },
        insert: () => { return new Promise(res => res('MockInsertOpts')) }
      });
      app = require('../app')({quiet: true});
      Util.dropAndCreateTableUrls(() => {
        done();
      });
    });
    after((done) => {
      Util.disableMockery();
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
  describe('GET /* (redirecting)', () => {
    describe('when short url not found', () => {
      before(() => {
        Util.mockUrl({
          where: () => { return new Promise(res => res([])) }
        });
        app = require('../app')({quiet: true});
      });
      after((done) => {
        Util.dropTableUrls(() => {
          done();
        });
      });
      it ('responds 404', () => {
        request(app)
          .get('/8bv2hhd8sawp')
          .expect(404);
      });
    });
    describe('when short url found', () => {
      beforeEach(() => {
        Util.mockNodeUrl({
          'parse': () => { return { pathname: '/8bv2hhd8sawp' } }
        });
      });
      describe('and mobile detected', () => {
        before(() => {
          Util.mockExpressDevice('phone');
        });
        beforeEach(() => {
          app = require('../app')({quiet: true});
        });
        describe('and mobile url available', () => {
          before(() => {
            Util.mockUrl({
              where: () => {
                return new Promise(res => res([{
                  attributes: {
                    desktop: 'https://www.google.com/',
                    mobile: 'https://www.google.com/mobile/'
                  }
                }]));
              },
              update: () => { return new Promise (res => res({})) },
              find: () => { return new Promise (res => res()) }
            });
          });
          it('responds with appropriate url', () => {
            request(app)
              .get('/8bv2hhd8sawp')
              .expect(302)
              .expect(res => {
              res.header['location']
                .should.equal('https://www.google.com/mobile/')
            });
          });
        });
        describe('but mobile url unavailable', () => {
          before(() => {
            Util.enableMockery();
            Util.mockUrl({
              where: () => {
                return new Promise(res => res([{
                  attributes: {
                    desktop: 'https://www.google.com/',
                    tablet: 'https://www.tablethotels.com/'
                  }
                }]));
              },
              update: () => { return new Promise (res => res({})) },
              find: () => { return new Promise (res => res()) }
            });
          });
          after(() => {
            Util.disableMockery();
          });
          it ('responds with default url (desktop)', (done) => {
            request(app)
              .get('/8bv2hhd8sawp')
              .expect(302)
              .expect(res => {
                res.header['location']
                .should.equal('https://www.google.com/')
              })
              .end(done);
          });
        });
      });
      describe('and desktop detected', () => {
        beforeEach(() => {
          Util.enableMockery();
          Util.mockExpressDevice('desktop');
          app = require('../app')({quiet: true});
        });
        afterEach(() => {
          Util.disableMockery();
        });
        describe('and desktop url available', () => {
          before(() => {
            Util.mockUrl({
              where: () => {
                return new Promise(res => res([{
                  attributes: {
                    desktop: 'https://www.google.com/',
                    mobile: 'https://www.google.com/mobile/'
                  }
                }]));
              },
              update: () => { return new Promise (res => res({})) },
              find: () => { return new Promise (res => res()) }
            });
          });
          it('redirects to appropriate url', (done) => {
            request(app)
              .get('/8bv2hhd8sawp')
              .expect(302)
              .expect(res => {
                res.header['location'].should.equal('https://www.google.com/');
              })
              .end(done);
          });
        });
        describe('but desktop url unavailable', () => {
          before(() => {
            Util.mockUrl({
              where: () => {
                return new Promise(res => res([{
                  attributes: {
                    mobile: 'https://www.google.com/mobile/'
                  }
                }]));
              },
              update: () => { return new Promise (res => res({})) },
              find: () => { return new Promise (res => res()) }
            });
          });
          it('responds 404', (done) => {
            request(app)
              .get('/8bv2hhd8sawp')
              .expect(404)
              .end(done);
          });
        });
      });
      describe('and tablet detected', () => {
        beforeEach(() => {
          Util.enableMockery();
          Util.mockExpressDevice('tablet');
          app = require('../app')({quiet: true});
        });
        afterEach(() => {
          Util.disableMockery();
        });
        describe('and tablet url available', () => {
          before(() => {
            Util.mockUrl({
              where: () => {
                return new Promise(res => res([{
                  attributes: {
                    desktop: 'https://www.google.com/',
                    tablet: 'https://www.tablethotels.com/'
                  }
                }]));
              },
              update: () => { return new Promise (res => res({})) },
              find: () => { return new Promise (res => res()) }
            });
          });
          it('redirects to appropriate url', (done) => {
            request(app)
              .get('/8bv2hhd8sawp')
              .expect(302)
              .expect(res => {
                res.header['location']
                  .should.equal('https://www.tablethotels.com/');
              })
              .end(done);
          });
        });
        describe('but tablet url unavailable', () => {
          before(() => {
            Util.mockUrl({
              where: () => {
                return new Promise(res => res([{
                  attributes: {
                    mobile: 'https://www.google.com/mobile/',
                    desktop: 'https://www.google.com/'
                  }
                }]));
              },
              update: () => { return new Promise (res => res({})) },
              find: () => { return new Promise (res => res()) }
            });
          });
          it('redirects to default url (desktop)', (done) => {
            request(app)
              .get('/8bv2hhd8sawp')
              .expect(302)
              .expect(res => {
                res.header['location'].should.equal('https://www.google.com/');
              })
              .end(done);
          });
        });
      });
    });
  });
});

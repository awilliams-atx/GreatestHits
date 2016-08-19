'use strict';

// NOTE: DBObject instance methods have no test coverage, and so are not used in "production".

const Url = require('../models/url.js');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const should = chai.should();
const sqlite3 = require('sqlite3');
const Util = require('./Util');

describe('Url model', function () {
  describe('when table does not exist', function () {
    before(function (done) {
      let db = new sqlite3.Database('./data.db', function () {
        db.run('DROP TABLE IF EXISTS urls;', [], () => {
          db.close();
          done();
        });
      });
    });
    it('::all rejects with error', (done) => {
      Url.all().should.eventually.be.rejectedWith(Error).notify(done);
    });
    it('::find rejects with error', (done) => {
      Url.find(5, {quiet: true})
        .should.eventually.be.rejectedWith(Error).notify(done);
    });
    it('::update rejects with error', (done) => {
      Url.update({
        set: { short: 'http://www.google.com/' },
        quiet: true
      }).should.eventually.be.rejectedWith(Error).notify(done);
    });
    it('::insert rejects with error', (done) => {
      Url.insert({
        tableName: 'urls',
        Constructor: Url,
        quiet: true,
        attributes: { short: 'http://www.google.com/'}
      }).should.eventually.be.rejectedWith(Error).notify(done);
    });
    it('::where rejects with error', (done) => {
      Url.where({
        where: { short: 'http://www.google.com/' },
        quiet: true
      }).should.eventually.be.rejectedWith(Error).notify(done);
    });
  });
  describe('when table is empty', function () {
    var db;
    beforeEach(done => {
      Util.dropAndCreateTableUrls(done);
    });
    after(done => {
      Util.dropTableUrls(done);
    });
    it('::all returns empty array', (done) => {
      Url.all().should.eventually.be.instanceof(Array).with.length(0).notify(done);
    });
    it('::find returns null', (done) => {
      Url.find(1, {quiet: true}).should.eventually.equal(null).notify(done);
    });
    it('::where returns empty array', (done) => {
      Url.where({
        conditions: { short: 'http://www.google.com' },
        quiet: true
      }).should.eventually.deep.equal([]).notify(done);
    });
  });
  describe('when table has rows', () => {
    describe('::all', () => {
      beforeEach(done => {
        Util.dropAndCreateTableUrls(() => {
          Util.insertGoogle(() => {
            done();
          });
        });
      });
      it('returns one-item array', (done) => {
        Url.all().should.eventually.have.length(1).notify(done);
      });
      it('returns two-item array', (done) => {
        Util.insertYahoo(() => {
          Url.all().should.eventually.have.length(2).notify(done);
        });
      });
    });
    describe('::find', () => {
      beforeEach(done => {
        Util.dropAndCreateTableUrls(() => {
          Util.insertGoogle(() => {
            done();
          });
        });
      });
      it('returns null when id not in table', (done) => {
        Url.find(2, {quiet: true}).should.eventually.equal(null).notify(done);
      });
      it('returns a JS wrapped database object', (done) => {
        Url.find(1, {quiet: true})
          .should.eventually.be.an.instanceof(Url).notify(done);
      });
      it('returns the correct object', (done) => {
        Util.insertYahoo(() => {
          Url.find(2, {quiet: true}).should.eventually.be.an.instanceof(Url)
            .with.deep.property('attributes.id', 2).notify(done);
        });
      });
    });
    describe('::insert', () => {
      beforeEach(done => {
        Util.dropAndCreateTableUrls(() => {
          Url.insert({
            Constructor: Url,
            tableName: 'urls',
            attributes: {short: '/h5g3n7m5k6h8', desktop: 'http://www.sqlzoo.com/'},
            quiet: true
          }).then(() => {
            done();
          });
        });
      });
      after(done => {
        Util.dropTableUrls(done);
      });
      it('inserts a record', (done) => {
        Util.selectSqlZoo((row) => {
          row.should.have.deep.property('id', 1);
          row.should.have.deep.property('desktop', 'http://www.sqlzoo.com/');
          done();
        });
      });
      it('automatically inserts createdAt, updatedAt', (done) => {
        Util.selectSqlZoo(row => {
          row.createdAt.should.match(/^\d+/);
          row.updatedAt.should.match(/^\d+/);
          done();
        });
      });
    });
    describe('::where', () => {
      beforeEach(done => {
        Util.dropAndCreateTableUrls(() => {
          Util.insertGoogle(() => {
            Util.insertYahoo(() => {
              Util.insertYahoo(() => {
                done();
              });
            });
          });
        });
      });
      afterEach(done => {
        Util.dropTableUrls(done);
      });
      it('returns an empty array when no matches found', (done) => {
        Url.where({
          where: { short: 'http://www.amazon.com/' },
          quiet: true
        }).should.eventually.deep.equal([]).notify(done);
      });
      it('returns an array with single matching url object', (done) => {
        Url.where({
          where: { desktop: 'http://www.google.com/' },
          quiet: true
        }).should.eventually.have.deep
          .property('[0].attributes.desktop', 'http://www.google.com/')
          .notify(done);
      });
      it('returns an array with several matching url objects', (done) => {
        var url = Url.where({
          where: { desktop: 'http://www.yahoo.com/' },
          quiet: true
        });
        url.should.eventually.have.length(2).notify(done);
      });
      it('returns Url instances when given Constructor', (done) => {
        var url = Url.where({
          where: { desktop: 'http://www.google.com/' },
          quiet: true
        });
        url.should.eventually.have.deep
          .property('[0].attributes').notify(done);
      });
    });
    describe('::update', () => {
      describe('updates', () => {
        beforeEach(done => {
          Util.dropAndCreateTableUrls(() => {
            Util.insertGoogle(() => {
              Url.update({
                where: { id: 1 },
                set: { short: 'http://www.gooogle.com/' },
                done: true,
                quiet: true
              }).then(() => {
                done();
              });
            });
          });
        });
        after(done => {
          Util.dropTableUrls(() => {
            done();
          });
        });
        it('single matching row', (done) => {
          Util.selectGooogle(row => {
            row.should.have.deep.property('short', 'http://www.gooogle.com/');
            done();
          });
        });
      });
      describe('updates', () => {
        before(done => {
          Util.dropAndCreateTableUrls(() => {
            Util.insertGoogle(() => {
              Util.insertYahoo(() => {
                Url.update({
                  set: { desktop: 'http://www.sqlzoo.com/' },
                  where: { desktop: 'http://www.google.com/' },
                  done: true,
                  quiet: true
                }).then(() => {
                  done();
                });
              });
            });
          });
        });
        after(done => {
          Util.dropTableUrls(() => {
            done();
          });
        });
        it('matching rows only', (done) => {
          Util.selectAll(rows => {
            rows[0].desktop.should.equal('http://www.sqlzoo.com/');
            rows[1].desktop.should.equal('http://www.yahoo.com/');
            done();
          });
        });
      });
      describe('updates', () => {
        before(done => {
          Util.dropAndCreateTableUrls(() => {
            Util.insertGoogle(() => {
              Util.insertYahoo(() => {
                Url.update({
                  set: { short: 'http://www.sqlzoo.com/' },
                  done: true,
                  quiet: true
                }).then(() => {
                  done();
                });
              });
            });
          });
        });
        after(done => {
          Util.dropTableUrls(() => {
            done();
          });
        });
        it('all rows', (done) => {
          Util.selectAll(rows => {
            rows[0].short.should.equal('http://www.sqlzoo.com/');
            rows[1].short.should.equal('http://www.sqlzoo.com/');
            done();
          });
        });
      });
    });
  });
  describe('::availableRandomString', () => {
    before(done => {
      Util.dropAndCreateTableUrls(() => {
        done();
      });
    });
    after(done => {
      Util.dropTableUrls(() => {
        done();
      });
    });
    it('returns a random, 12-digit url-safe string', () => {
      return Promise.all([
        Url.availableRandomString({quiet: true}).should.eventually
          .have.property('substring'),
        Url.availableRandomString({quiet: true}).should.eventually
          .have.length(12),
        Url.availableRandomString().should.eventually
          .match(/^[a-zA-Z0-9_-]*$/)
      ]);
    });
  });
});

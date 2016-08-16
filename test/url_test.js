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
      Url.all({
        tableName: 'urls',
        quiet: true
      }).should.eventually.be.rejectedWith(Error).notify(done);
    });
    it('::find rejects with error', (done) => {
      Url.find({
        tableName: 'urls',
        Constructor: Url,
        id: 5,
        quiet: true
      }).should.eventually.be.rejectedWith(Error).notify(done);
    });
    it('::update rejects with error', (done) => {
      Url.update({
        tableName: 'urls',
        set: { short: 'http://www.google.com/' },
        quiet: true
      }).should.eventually.be.rejectedWith(Error).notify(done);
    });
    it('::insert rejects with error', (done) => {
      Url.insert({
        tableName: 'urls',
        quiet: true,
        attributes: { short: 'http://www.google.com/'}
      }).should.eventually.be.rejectedWith(Error).notify(done);
    });
    it('::where rejects with error', (done) => {
      Url.where({
        tableName: 'urls',
        where: { short: 'http://www.google.com/' },
        quiet: true
      }).should.eventually.be.rejectedWith(Error).notify(done);
    });
    it('#insert rejects with error', (done) => {
      let url = new Url({
        short: 'http://www.google.com/'
      });
      url.insert({
        quiet: true,
        done: true
      }).should.eventually.be.rejectedWith(Error).notify(done);
    });
    it('#update rejects with error', (done) => {
      let url = new Url({
        id: 1,
        short: 'http://www.google.com/'
      });
      url.update({
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
      Url.all({
        tableName: 'urls'
      }).should.eventually.be.instanceof(Array).with.length(0).notify(done);
    });
    it('::find returns null', (done) => {
      Url.find({
        Constructor: Url,
        tableName: 'urls',
        id: 1,
        quiet: true
      }).should.eventually.equal(null).notify(done);
    });
    it('::where returns empty array', (done) => {
      Url.where({
        tableName: 'urls',
        conditions: { short: 'http://www.google.com' },
        Constructor: Url,
        quiet: true
      }).should.eventually.deep.equal([]).notify(done);
    });
  });
  describe('when table has rows', () => {
    describe('::all', () => {
      beforeEach((done) => {
        Util.dropAndCreateTableUrls(() => {
          Util.insertGoogle(() => {
            done();
          });
        });
      });
      it('returns one-item array', (done) => {
        Url.all({
          tableName: 'urls',
        }).should.eventually.have.length(1).notify(done);
      });
      it('returns two-item array', (done) => {
        Util.insertYahoo(() => {
          Url.all({
            tableName: 'urls'
          }).should.eventually.have.length(2).notify(done);
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
        Url.find({tableName: 'urls', Constructor: Url, id: 2, quiet: true}).should.eventually.equal(null).notify(done);
      });
      it('returns a JS wrapped database object', (done) => {
        Url.find({
          tableName: 'urls',
          Constructor: Url,
          id: 1,
          quiet: true
        }).should.eventually.be.an.instanceof(Url).notify(done);
      });
      it('returns the correct object', (done) => {
        Util.insertYahoo(() => {
          Url.find({
            tableName: 'urls',
            Constructor: Url,
            id: 2,
            quiet: true
          }).should.eventually.be.an.instanceof(Url)
            .with.deep.property('attributes.id', 2).notify(done);
        });
      });
    });
    describe('::insert', () => {
      beforeEach(done => {
        Util.dropAndCreateTableUrls(() => {
          Url.insert({
            tableName: 'urls',
            attributes: {short: 'http://www.sqlzoo.com/'},
            quiet: true
          }).then(() => {
            done();
          });
        });
      });
      after(done => {
        Util.dropTableUrls(done);
      });
      after(done => {
        Util.dropTableUrls(done);
      });
      it('inserts a record', (done) => {
        Util.selectSqlZoo((row) => {
          row.should.have.deep.property('id', 1);
          row.should.have.deep.property('short', 'http://www.sqlzoo.com/');
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
      after(done => {
        Util.dropTableUrls(done);
      });
      it('returns an empty array when no matches found', (done) => {
        var url = Url.where({
          tableName: 'urls',
          where: { short: 'http://www.amazon.com/' },
          quiet: true
        });
        url.should.eventually.deep.equal([]).notify(done);
      });
      it('returns an array with single matching url objects', (done) => {
        var url = Url.where({
          tableName: 'urls',
          where: { short: 'http://www.google.com/' },
          quiet: true
        });
        url.should.eventually.have.deep
          .property('[0].short', 'http://www.google.com/').notify(done);
      });
      it('returns an array with several matching url objects', (done) => {
        var url = Url.where({
          tableName: 'urls',
          where: { short: 'http://www.yahoo.com/' },
          quiet: true
        });
        url.should.eventually.have.length(2).notify(done);
      });
      it('returns Url instances when given Constructor', (done) => {
        var url = Url.where({
          Constructor: Url,
          tableName: 'urls',
          where: { short: 'http://www.google.com/' },
          quiet: true
        });
        url.should.eventually.have.deep
          .property('[0].tableName').notify(done);
      });
    });
    describe('::update', () => {
      describe('updates', () => {
        beforeEach(done => {
          Util.dropAndCreateTableUrls(() => {
            Util.insertGoogle(() => {
              Url.update({
                tableName: 'urls',
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
                  tableName: 'urls',
                  set: { short: 'http://www.sqlzoo.com/' },
                  where: { short: 'http://www.google.com/' },
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
            rows[0].short.should.equal('http://www.sqlzoo.com/');
            rows[1].short.should.equal('http://www.yahoo.com/');
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
                  tableName: 'urls',
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
  describe('::AvailableRandomString', () => {
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
        Url.AvailableRandomString({quiet: true}).should.eventually
          .have.property('substring'),
        Url.AvailableRandomString({quiet: true}).should.eventually
          .have.length(12),
        Url.AvailableRandomString().should.eventually
          .match(/^[a-zA-Z0-9_-]*$/)
      ]);
    });
  });
});

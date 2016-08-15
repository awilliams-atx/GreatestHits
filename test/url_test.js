'use strict';

const Url = require('../models/url.js');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const should = chai.should();
const sqlite3 = require('sqlite3');

describe('Url model', function () {
  var db, dropAndCreateTableUrls, dropTableUrls, insertGoogle, insertYahoo, selectSqlZoo;
  beforeEach(() => {
    dropAndCreateTableUrls = function (cb) {
      db = new sqlite3.Database('./data.db', () => {
        db.serialize(() => {
          db.run('DROP TABLE IF EXISTS urls;').run('CREATE TABLE urls (id INTEGER PRIMARY KEY AUTOINCREMENT, long TEXT NOT NULL, desktop TEXT, mobile TEXT, tablet TEXT, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL);', [], () => {
            db.close();
            cb();
          });
        });
      });
    };
    dropTableUrls = function (cb) {
      db = new sqlite3.Database('./data.db', () => {
        db.run('DROP TABLE IF EXISTS urls;', [], () => {
          db.close();
          cb && cb();
        });
      });
    };
    insertGoogle = function (cb) {
      db = new sqlite3.Database('./data.db', () => {
        db.serialize(function () {
          db.run("INSERT INTO urls (long, desktop, mobile, tablet, createdAt, updatedAt) VALUES ('http://www.google.com/', '54354gdsm', 'fdjs8f98f2', '0sd9fj23', datetime(), datetime());", [], () => {
            db.close();
            cb();
          });
        });
      });
    };
    insertYahoo = function (cb) {
      db = new sqlite3.Database('./data.db', () => {
        db.run("INSERT INTO urls (long, desktop, mobile, tablet, createdAt, updatedAt) VALUES ('http://www.yahoo.com/', '5teff2', 'dsf234f', 'h7j8rwece', datetime(), datetime());", [], () => {
          db.close();
          cb();
        });
      });
    };
    selectSqlZoo = function (cb) {
      db = new sqlite3.Database('./data.db', () => {
        db.get("SELECT * FROM urls WHERE long = 'http://www.sqlzoo.com/';"
          , [], (err, row) => {
          if (err) {
            db.close();
            return cb(err);
          } else {
            db.close();
            return cb(row);
          }
        });
      });
    }
  });
  describe('when table does not exist', function () {
    var db;
    before(function (done) {
      db = new sqlite3.Database('./data.db', function () {
        db.run('DROP TABLE IF EXISTS urls;', [], () => {
          db.close();
          done();
        });
      });
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
        set: { long: 'http://www.google.com/' },
        quiet: true
      }).should.eventually.be.rejectedWith(Error).notify(done);
    });
    it('::insert rejects with error', (done) => {
      Url.insert({
        tableName: 'urls',
        quiet: true,
        attributes: { long: 'http://www.google.com/'}
      }).should.eventually.be.rejectedWith(Error).notify(done);
    });
    it('::where rejects with error', (done) => {
      Url.where({
        tableName: 'urls',
        where: { long: 'http://www.google.com/' },
        quiet: true
      }).should.eventually.be.rejectedWith(Error).notify(done);
    });
    it('#insert rejects with error', (done) => {
      let url = new Url({
        long: 'http://www.google.com/'
      });
      url.insert({
        quiet: true,
        done: true
      }).should.eventually.be.rejectedWith(Error).notify(done);
    });
    it('#update rejects with error', (done) => {
      let url = new Url({
        id: 1,
        long: 'http://www.google.com/'
      });
      url.update({
        quiet: true
      }).should.eventually.be.rejectedWith(Error).notify(done);
    });
  });
  describe('when table is empty', function () {
    var db;
    beforeEach(done => {
      dropAndCreateTableUrls(done);
    });
    after(done => {
      dropTableUrls(done);
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
        conditions: { long: 'http://www.google.com' },
        Constructor: Url,
        quiet: true
      }).should.eventually.deep.equal([]).notify(done);
    });
  });
  describe('when table has rows', () => {
    describe('::find', () => {
      beforeEach(done => {
        dropAndCreateTableUrls(() => {
          insertGoogle(() => {
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
        insertYahoo(() => {
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
        dropAndCreateTableUrls(() => {
          Url.insert({
            tableName: 'urls',
            attributes: {long: 'http://www.sqlzoo.com/'},
            quiet: true
          }).then(() => {
            done();
          });
        });
      });
      after(done => {
        dropTableUrls(done);
      });
      after(done => {
        dropTableUrls(done);
      });
      it('inserts a record', (done) => {
        selectSqlZoo((row) => {
          row.should.have.deep.property('id', 1);
          row.should.have.deep.property('long', 'http://www.sqlzoo.com/');
          done();
        });
      });
      it('automatically inserts createdAt, updatedAt', (done) => {
        selectSqlZoo(row => {
          row.createdAt.should.match(/^\d+/);
          row.updatedAt.should.match(/^\d+/);
          done();
        });
      });
    });
    describe('::where', () => {
      beforeEach(done => {
        dropAndCreateTableUrls(() => {
          insertGoogle(() => {
            insertYahoo(() => {
              insertYahoo(() => {
                done();
              });
            });
          });
        });
      });
      it('returns an empty array when no matches found', (done) => {
        var url = Url.where({
          tableName: 'urls',
          where: { long: 'http://www.amazon.com/' }
        });
        url.should.eventually.deep.equal([]).notify(done);
      });
      it('returns an array with single matching url objects', (done) => {
        var url = Url.where({
          tableName: 'urls',
          where: { long: 'http://www.google.com/' },
          quiet: true
        });
        url.should.eventually.have.deep.property('[0].long', 'http://www.google.com/').notify(done);
      });
      it('returns an array with several matching url objects', (done) => {
        var url = Url.where({
          tableName: 'urls',
          where: { long: 'http://www.yahoo.com/' },
          quiet: true
        });
        url.should.eventually.have.length(2).notify(done);
      });
      it('returns Url instances when given Constructor', (done) => {
        var url = Url.where({
          Constructor: Url,
          tableName: 'urls',
          where: { long: 'http://www.google.com/' },
          quiet: true
        });
        url.should.eventually.have.deep.property('[0].tableName', 'urls').notify(done);
      });
    });
  });
});

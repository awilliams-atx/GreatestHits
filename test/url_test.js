'use strict';

const Url = require('../models/url.js');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const should = chai.should();
const sqlite3 = require('sqlite3');

describe('Url model', function () {
  var db, insertGoogle, insertYahoo;
  beforeEach(function () {
    insertGoogle = function (cb) {
      db = new sqlite3.Database('./data.db', function () {
        db.serialize(function () {
          db.run('DROP TABLE IF EXISTS urls;').run('CREATE TABLE urls (id INTEGER PRIMARY KEY AUTOINCREMENT, long TEXT NOT NULL, desktop TEXT, mobile TEXT, tablet TEXT, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL);').run("INSERT INTO urls (long, desktop, mobile, tablet, createdAt, updatedAt) VALUES ('http://www.google.com', '54354gdsm', 'fdjs8f98f2', '0sd9fj23', datetime(), datetime());", [], () => {
            db.close();
            cb();
          });
        });
      });
    };
    insertYahoo = function (cb) {
      db = new sqlite3.Database('./data.db', function () {
        db.run("INSERT INTO urls (long, desktop, mobile, tablet, createdAt, updatedAt) VALUES ('http://www.yahoo.com', '5teff2', 'dsf234f', 'h7j8rwece', datetime(), datetime());", [], () => {
          db.close();
          cb();
        });
      });
    };
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
    it('::find rejects with error', function (done) {
      Url.find({tableName: 'urls', Constructor: Url, id: 5, quiet: true}).should.eventually.be.rejectedWith(Error).notify(done);
    });
    it('::update rejects with error', function (done) {
      Url.update({tableName: 'urls', set: { long: 'http://www.google.com/' }, quiet: true}).should.eventually.be.rejectedWith(Error).notify(done);
    });
    it('::insert rejects with error', function (done) {
      Url.insert({tableName: 'urls', quiet: true, attributes: { long: 'http://www.google.com/' }}).should.eventually.be.rejectedWith(Error).notify(done);
    });
    it('::where rejects with error', function (done) {
      Url.where({tableName: 'urls', where: { long: 'http://www.google.com/' }, quiet: true}).should.eventually.be.rejectedWith(Error).notify(done);
    });
    it('#insert rejects with error', function (done) {
      let url = new Url({long: 'http://www.google.com/'});
      url.insert({quiet: true, done: true}).should.eventually.be.rejectedWith(Error).notify(done);
    });
    it('#update rejects with error', function (done) {
      let url = new Url({id: 1, long: 'http://www.google.com/'});
      url.update({quiet: true}).should.eventually.be.rejectedWith(Error).notify(done);
    });
  });
  describe('when table is empty', function () {
    var db;
    before(function (done) {
      db = new sqlite3.Database('./data.db', function () {
        db.serialize(function () {
          db.run('DROP TABLE IF EXISTS urls').run('CREATE TABLE urls (id INTEGER PRIMARY KEY AUTOINCREMENT);', [], (err) => {
            done();
          });
        });
      });
    });
    after(function (done) {
      db = new sqlite3.Database('./data.db').run('DROP TABLE urls;', [], () => {
        done();
      });
    });
    it('::find returns null', function (done) {
      Url.find({Constructor: Url, tableName: 'urls', id: 1, quiet: true}).should.eventually.equal(null).notify(done);
    });
    it('::where returns empty array', function (done) {
      Url.where({tableName: 'urls', conditions: { long: 'http://www.google.com'}, Constructor: Url, quiet: true}).should.eventually.deep.equal([]).notify(done);
    });
  });
  describe('when table has rows', function () {
    describe('::find', function () {
      beforeEach(function (done) {
        insertGoogle(function () { done(); });
      });
      it('returns null when id not in table', function (done) {
        Url.find({tableName: 'urls', Constructor: Url, id: 2, quiet: true}).should.eventually.equal(null).notify(done);
      });
      it('returns a JS wrapped database object', function (done) {
        Url.find({tableName: 'urls', Constructor: Url, id: 1, quiet: true}).should.eventually.be.an.instanceof(Url).notify(done);
      });
      it('returns the correct object', function (done) {
        insertYahoo(function () {
          Url.find({
            tableName: 'urls',
            Constructor: Url,
            id: 2,
            quiet: true
          }).should.eventually.be.an.instanceof(Url).with.deep.property('attributes.id', 2).notify(done);
        });
      });
    });
    describe('::insert', function () {

    });
  });
});

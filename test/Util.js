'use strict';

const app = require('../app');
const mockery = require('mockery');
const sqlite3 = require('sqlite3');
const Url = require('../models/url.js');

module.exports = {
  disableMockery: function () {
    mockery.disable();
  },
  dropAndCreateTableUrls: function (cb) {
    let db = new sqlite3.Database('./data.db', () => {
      db.serialize(() => {
        db.run('DROP TABLE IF EXISTS urls;').run('CREATE TABLE urls (id INTEGER PRIMARY KEY AUTOINCREMENT, long TEXT NOT NULL, desktop TEXT, mobile TEXT, tablet TEXT, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL);', [], () => {
          db.close();
          cb && cb();
        });
      });
    });
  },
  dropTableUrls: function (cb) {
    let db = new sqlite3.Database('./data.db', () => {
      db.run('DROP TABLE IF EXISTS urls;', [], () => {
        db.close();
        cb && cb();
      });
    });
  },
  insertGoogle: function (cb) {
    let db = new sqlite3.Database('./data.db', () => {
      db.serialize(function () {
        db.run("INSERT INTO urls (long, desktop, mobile, tablet, createdAt, updatedAt) VALUES ('http://www.google.com/', '54354gdsm', 'fdjs8f98f2', '0sd9fj23', datetime(), datetime());", [], () => {
          db.close();
          cb && cb();
        });
      });
    });
  },
  insertYahoo: function (cb) {
    let db = new sqlite3.Database('./data.db', () => {
      db.run("INSERT INTO urls (long, desktop, mobile, tablet, createdAt, updatedAt) VALUES ('http://www.yahoo.com/', '5teff2', 'dsf234f', 'h7j8rwece', datetime(), datetime());", [], () => {
        db.close();
        cb && cb();
      });
    });
  },
  mockUrl: function (mock) {
    mockery.enable({
      warnOnUnregistered: false,
      warnOnReplace: false,
      useCleanCache: true
    });
    mockery.registerMock('../models/url.js', mock);
  },
  selectAll: function (cb) {
    let db = new sqlite3.Database('./data.db', () => {
      db.all("SELECT * FROM urls;"
      , [], (err, rows) => {
        if (err) {
          db.close();
          return cb(err);
        } else {
          db.close();
          return cb(rows);
        }
      });
    });
  },
  selectGooogle: function (cb) {
    let db = new sqlite3.Database('./data.db', () => {
      db.get("SELECT * FROM urls WHERE long = 'http://www.gooogle.com/';"
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
  },
  selectSqlZoo: function (cb) {
    let db = new sqlite3.Database('./data.db', () => {
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
};
beforeEach(() => {

  var dropAndCreateTableUrls,
    dropTableUrls,
    insertGoogle,
    insertYahoo,
    selectAll,
    selectGooogle,
    selectSqlZoo;
  dropAndCreateTableUrls = function (cb) {
    let db = new sqlite3.Database('./data.db', () => {
      db.serialize(() => {
        db.run('DROP TABLE IF EXISTS urls;').run('CREATE TABLE urls (id INTEGER PRIMARY KEY AUTOINCREMENT, long TEXT NOT NULL, desktop TEXT, mobile TEXT, tablet TEXT, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL);', [], () => {
          db.close();
          cb && cb();
        });
      });
    });
  };
  dropTableUrls = function (cb) {
    let db = new sqlite3.Database('./data.db', () => {
      db.run('DROP TABLE IF EXISTS urls;', [], () => {
        db.close();
        cb && cb();
      });
    });
  };
  insertGoogle = function (cb) {
    let db = new sqlite3.Database('./data.db', () => {
      db.serialize(function () {
        db.run("INSERT INTO urls (long, desktop, mobile, tablet, createdAt, updatedAt) VALUES ('http://www.google.com/', '54354gdsm', 'fdjs8f98f2', '0sd9fj23', datetime(), datetime());", [], () => {
          db.close();
          cb && cb();
        });
      });
    });
  };
  insertYahoo = function (cb) {
    let db = new sqlite3.Database('./data.db', () => {
      db.run("INSERT INTO urls (long, desktop, mobile, tablet, createdAt, updatedAt) VALUES ('http://www.yahoo.com/', '5teff2', 'dsf234f', 'h7j8rwece', datetime(), datetime());", [], () => {
        db.close();
        cb && cb();
      });
    });
  };
  selectAll = function (cb) {
    let db = new sqlite3.Database('./data.db', () => {
      db.all("SELECT * FROM urls;"
      , [], (err, rows) => {
        if (err) {
          db.close();
          return cb(err);
        } else {
          db.close();
          return cb(rows);
        }
      });
    });
  }
  selectGooogle = function (cb) {
    let db = new sqlite3.Database('./data.db', () => {
      db.get("SELECT * FROM urls WHERE long = 'http://www.gooogle.com/';"
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
  };
  selectSqlZoo = function (cb) {
    let db = new sqlite3.Database('./data.db', () => {
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

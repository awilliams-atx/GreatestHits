'use strict';
const sqlite3 = require('sqlite3');
const dbPath = './data.db';
const QueryHelper = require('./QueryHelper.js');
const DBParse = require('./DBParse.js');

class DBObject {
  static all (op) {
    QueryHelper.setDbProps(this, op);
    if (!op.db) { op.db = this.open(); }
    if (op.done === undefined) { op.done = true; }
    return new Promise((res, rej) => {
      op.db.all(`SELECT * FROM ${op.tableName};`, [], (err, rows) => {
        if (err) {
          op.db.close();
          rej(err);
        } else {
          rows = rows.map(row => {
            return new this(DBParse.attributes(row));
          });
          if (op.done) {
            op.db.close();
            res(rows);
          } else {
            op.rows = rows;
            res(op);
          }
        }
      });
    });
  }

  static find (op) {
    if (!op.Constructor && !op.dbObject) {
      if (op.db) { op.db.close(); }
      throw '::find must be supplied with DBObject Constructor or instance';
    }
    if (!op.dbObject && !op.tableName) {
      if (op.db) { op.db.close(); }
      throw '::find when given Constructor must be supplied with tableName';
    }
    if (!op.id && !op.dbObject.attributes.id) {
      throw '::find detected no id';
    }
    let id = op.id ? op.id : op.dbObject.attributes.id;
    if (op.db === undefined) { op.db = DBObject.open(); }
    if (op.done === undefined) { op.done = true; }
    let tableName = op.tableName || op.dbObject.tableName;
    let query = `SELECT * FROM ${tableName} WHERE id = ${id};`
    if (!op.quiet) { console.log(query); }
    return new Promise((res, rej) => {
      op.db.get(query, (err, record)  => {
        if (err) {
          op.db.close();
          rej(err);
        } else if (record === undefined) {
          if (!op.quiet) { console.log('Record Not Found'); }
          op.db.close();
          res(null);
        } else {
          if (!op.quiet) { console.log('1 Record Retrieved'); }
          if (op.dbObject) {
            op.dbObject.attributes = [];
            op.dbObject.set(DBParse.attributes(record));
          } else {
            op.dbObject = new op.Constructor(DBParse.attributes(record));
          }
          if (op.done) {
            op.db.close();
            res(op.dbObject);
          } else {
            res(op);
          }
        }
      });
    });
  }

  static insert (op) {
    if (op.db === undefined) { op.db = DBObject.open(); }
    if (op.done === undefined) { op.done = false; }
    if (!op.dbObject && !op.tableName) {
      op.db.close();
      throw '::insert must be supplied with dbObject instance or tableName';
    }
    QueryHelper.addTimestamps(op);
    QueryHelper.setDefaults(this, op);
    let questionMarks = QueryHelper.questionMarks(op);
    let colsAndVals = QueryHelper.colsAndVals(op);
    let cols = colsAndVals.cols;
    let vals = colsAndVals.vals;
    return new Promise ((res, rej) => {
      op.db.serialize(function () {
        let tableName = op.tableName ? op.tableName : op.dbObject.tableName;
        let stmt = op.db.prepare(`INSERT INTO ${tableName} ${cols} VALUES ${questionMarks}`, [], (err) => {
          if (err) {
            op.db.close();
            rej(err);
          } else {
            stmt.run(vals);
            stmt.finalize();
            if (!op.quiet) { QueryHelper.logInsert(stmt, vals); } // Logging
            op.db.get(`SELECT last_insert_rowid() FROM ${tableName} LIMIT 1`, (err, row) => {
              if (err) {
                if (op.done) { op.db.close(); }
                rej(err);
              } else {
                if (op.dbObject) {
                  op.dbObject.set({id: row['last_insert_rowid()']});
                } else {
                  op.id = row['last_insert_rowid()'];
                }
                res(op);
              }
            });
          }
        });
      });
    });
  }

  static open () {
    return new sqlite3.Database(dbPath);
  }

  static update (op) {
    if (!op.dbObject && !op.tableName) {
      if (op.db) { op.db.close(); }
      throw '::update must be supplied with DBObject instance or tableName';
    }
    QueryHelper.updateTimestamp(op);
    if (op.db === undefined) { op.db = DBObject.open(); }
    let queryString = QueryHelper.updateString(op);
    if (!op.quiet) { console.log(queryString); }
    return new Promise ((res, rej) => {
      op.db.run(queryString, [], (err) => {
        if (err) {
          op.db.close();
          rej(err);
        } else {
          if (op.done) { op.db.close(); }
          res(op);
        }
      });
    });
  }

  static where (op) {
    QueryHelper.setDbProps(this, op);
    if (!op.db) { op.db = DBObject.open(); }
    if (op.done === undefined) { op.done = true; }
    let queryString = QueryHelper.whereString(op);
    if (!op.quiet) { console.log(queryString); }
    return new Promise ((res, rej) => {
      op.db.all(queryString, [], (err, rows) => {
        if (rows === undefined) { rows = []; }
        if (op.Constructor) {
          rows = rows.map(row => {
            return new op.Constructor(DBParse.attributes(row));
          });
        }
        if (err) {
          op.db.close();
          rej(err);
        } else {
          if (op.done) {
            op.db.close();
            res(rows);
          } else {
            op.rows = rows;
            res(op);
          }
        }
      });
    });
  }

  set (op) {
    this.attributes = Object.assign(this.attributes, op);
  }
}

module.exports = DBObject;

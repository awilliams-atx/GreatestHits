'use strict';
const sqlite3 = require('sqlite3');
const dbPath = './data.db';
const QueryHelper = require('./QueryHelper.js');
const DBParse = require('./DBParse.js');

class DBObject {
  static insert (op) {
    if (op.db === undefined) { op.db = DBObject.open(); }
    if (!op.record || !op.dbObject) {
      op.db.close();
      throw 'Must supply dbObject and record';
    }
    QueryHelper.addTimestamps(op.record);
    let questionMarks = QueryHelper.questionMarks(op.record);
    let colsAndVals = QueryHelper.colsAndVals(op.record);
    let cols = colsAndVals.cols;
    let vals = colsAndVals.vals;
    return new Promise ((res, rej) => {
      op.db.serialize(function () {
        let stmt = op.db.prepare(`INSERT INTO ${op.dbObject.tableName} ${cols} VALUES ${questionMarks}`);
        QueryHelper.logInsert(stmt, vals);
        stmt.run(vals);
        stmt.finalize();
        op.db.get(`SELECT last_insert_rowid() FROM ${op.dbObject.tableName} LIMIT 1`, (err, row) => {
          if (err) {
            op.db.close();
            rej(err);
          } else {
            op.id = row['last_insert_rowid()'];
            res(op);
          }
        });
      });
    });
  }

  static open () {
    return new sqlite3.Database(dbPath);
  }

  static update (op) {
    QueryHelper.updateTimestamp(op);
    if (op.db === undefined) { op.db = DBObject.open(); }
    if (!op.dbObject) {
      op.db.close();
      throw 'Must supply dbObject';
    }
    let queryString = QueryHelper.updateString(op);
    console.log(queryString); // Logging

    return new Promise ((res, rej) => {
      op.db.run(queryString, [], (err) => {
        if (err) {
          op.db.close();
          rej(err);
        } else {
          if (!op.keepOpen) { op.db.close(); }
          res(op);
        }
      });
    });
  }

  find (op) {
    if (op.db === undefined) { op.db = DBObject.open(); }
    let query = `SELECT * FROM ${this.tableName} WHERE id = ${op.id};`
    console.log(query); // Logging
    return new Promise((res, rej) => {
      op.db.get(query, (err, record)  => {
        if (err) {
          op.db.close();
          rej(err);
        }
        if (record === undefined) {
          op.db.close();
          throw 'Record Undefined';
        }
        console.log('1 Record Retrieved'); // Logging
        this.attributes = DBParse.attributes(record);
        if (op.keepOpen) {
          op.dbObject = this;
          res(op);
        } else {
          op.db.close();
          res(this);
        }
      });
    });
  }

  insert () {
    return DBObject.insert(this.tableName, this.attributes);
  }
}

module.exports = DBObject;

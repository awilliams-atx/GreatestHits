'use strict';
const sqlite3 = require('sqlite3');
const dbPath = './data.db';
const QueryHelper = require('./QueryHelper.js');
const DBParse = require('./DBParse.js');

class DBObject {
  static insert (op) {
    if (op.db === undefined) { op.db = DBObject.open(); }
    if (op.done === undefined) { op.done = false; }
    if (!op.dbObject) {
      op.db.close();
      throw 'Must supply dbObject and record';
    }
    QueryHelper.addTimestamps(op);
    let questionMarks = QueryHelper.questionMarks(op);
    let colsAndVals = QueryHelper.colsAndVals(op);
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
            if (op.done) { op.db.close(); }
            rej(err);
          } else {
            op.dbObject.set({id: row['last_insert_rowid()']});
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
    if (!op.dbObject && !op.tableName) {
      if (op.db) { op.db.close(); }
      throw '::update must be supplied with DBObject instance or tableName';
    }
    QueryHelper.updateTimestamp(op);
    if (op.db === undefined) { op.db = DBObject.open(); }
    let queryString = QueryHelper.updateString(op);
    console.log(queryString); // Logging

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

  static find (op) {
    if (!op.dbObject) { throw '::find must be supplied with DBObject'; }
    let id = op.id ? op.id : op.dbObject.attributes.id;
    if (op.db === undefined) { op.db = DBObject.open(); }
    if (op.done === undefined) { op.done = true; }
    let query = `SELECT * FROM ${op.dbObject.tableName} WHERE id = ${id};`
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
        op.dbObject.set(DBParse.attributes(record));
        if (!op.done) {
          res(op);
        } else {
          op.db.close();
          res(op.dbObject);
        }
      });
    });
  }

  static where (op) {
    if (!op.tableName) {
      throw '::where must be supplied with tableName'
    }
    if (!op.db) { op.db = DBObject.open(); }
    if (op.done === undefined) { op.done = true; }
    let queryString = QueryHelper.whereString(op);
    console.log(queryString);
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

  insert (op) {
    if (op === undefined) { op = { done: false }; }
    if (op.done === undefined) { op.done = false; }
    return DBObject.insert(Object.assign({dbObject: this}), op);
  }

  set (op) {
    this.attributes = Object.assign(this.attributes, op);
  }

  update (op) {
    if (op === undefined) { op = { done: false }; }
    if (op.done === undefined) { op.done = false; }
    if (!this.attributes.id) {
      throw 'DBObject#update Error: No ID Detected'
    }
    return DBObject.update(Object.assign({
      dbObject: this,
      set: this.attributes,
      where: { id: this.attributes.id },
      done: op.done
    }, op));
  }
}

module.exports = DBObject;

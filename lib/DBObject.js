'use strict';
const sqlite3 = require('sqlite3');
const dbPath = './data.db';
const QueryHelper = require('./QueryHelper.js');

class DBObject {
  static all (op) {
    op = QueryHelper.basicOptions(this, op);
    return new Promise((res, rej) => {
      op.db.all(`SELECT * FROM ${op.tableName};`, [], (err, rows) => {
        if (err) {
          op.db.close();
          rej(err);
        } else {
          op.rows = QueryHelper.parseAttributes(this, rows);
          QueryHelper.resolvePromise(res, op.rows, op);
        }
      });
    });
  }

  static find (id, op) {
    if (typeof id !== 'number' && typeof id !== 'string') {
      throw '::find must be passed number id'
    }
    op = QueryHelper.basicOptions(this, op);
    let query = `SELECT * FROM ${op.tableName} WHERE id = ${id};`
    QueryHelper.log(query, op);
    return new Promise((res, rej) => {
      op.db.get(query, (err, record)  => {
        if (err) {
          op.db.close();
          rej(err);
        } else if (record === undefined) {
          QueryHelper.log('Record Not Found', op);
          op.db.close();
          res(null);
        } else {
          QueryHelper.log('1 Record Retrievied', op);
          op.dbObject = QueryHelper.parseAttributes(this, record);
          QueryHelper.resolvePromise(res, op.dbObject, op);
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
                op.db.close();
                rej(err);
              } else {
                op.id = row['last_insert_rowid()'];
                QueryHelper.resolvePromise(res, null, op);
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
    op = QueryHelper.basicOptions(this, op);
    QueryHelper.updateTimestamp(op);
    QueryHelper.extractId(op);
    let queryString = QueryHelper.updateString(op);
    QueryHelper.log(queryString, op);
    return new Promise ((res, rej) => {
      op.db.run(queryString, [], (err) => {
        if (err) {
          op.db.close();
          rej(err);
        } else {
          QueryHelper.resolvePromise(res, null, op);
        }
      });
    });
  }

  static where (op) {
    op = QueryHelper.basicOptions(this, op);
    let queryString = QueryHelper.whereString(op);
    QueryHelper.log(queryString, op);
    return new Promise ((res, rej) => {
      op.db.all(queryString, [], (err, rows) => {
        if (rows === undefined) { rows = []; }
        rows = QueryHelper.parseAttributes(this, rows);
        if (err) {
          op.db.close();
          rej(err);
        } else {
          QueryHelper.resolvePromise(res, op.rows, op);
        }
      });
    });
  }

  set (op) {
    this.attributes = Object.assign(this.attributes, op);
  }
}

module.exports = DBObject;

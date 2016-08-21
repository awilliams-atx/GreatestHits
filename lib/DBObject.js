'use strict';
const sqlite3 = require('sqlite3');
const dbPath = './data.db';
const QueryHelper = require('./QueryHelper.js');

class DBObject {
  static all (op) {
    op = QueryHelper.basicOptions(this, op);
    return new Promise((res, rej) => {
      op.db.all(`SELECT * FROM ${op.tableName};`, [], (err, rows) => {
        QueryHelper.checkForError(rej, err, op, () => {
          QueryHelper.resolveAllPromise(res, op, rows);
        });
      });
    });
  }

  static find (id, op) {
    if (typeof id !== 'number' && typeof id !== 'string') {
      throw '::find must be passed number id'
    }
    op = QueryHelper.findOptions(this, op, id);
    QueryHelper.log(op.queryString, op);
    return new Promise((res, rej) => {
      op.db.get(op.queryString, (err, record)  => {
        QueryHelper.checkForError(rej, err, op, () => {
          if (record === undefined) {
            QueryHelper.log('Record Not Found', op);
            op.db.close();
            res(null);
          } else {
            QueryHelper.resolveFindPromise(res, op, record);
          }
        });
      });
    });
  }

  static insert (op) {
    op = QueryHelper.insertOptions(this, op);
    return new Promise ((res, rej) => {
      op.db.serialize(function () {
        let stmt = op.db.prepare(op.queryString, [], (err) => {
          QueryHelper.checkForError(rej, err, op, () => {
            stmt.run(op.vals);
            stmt.finalize();
            QueryHelper.logInsert(stmt, op); // Logging
            op.db.get(QueryHelper.lastInsertRowIdString(op), (err, row) => {
              QueryHelper.checkForError(rej, err, op, () => {
                QueryHelper.resolveInsertPromise(res, op, row);
              });
            });
          });
        });
      });
    });
  }

  static open () {
    return new sqlite3.Database(dbPath);
  }

  static update (op) {
    op = QueryHelper.updateOptions(this, op);
    QueryHelper.log(op.queryString, op);
    return new Promise ((res, rej) => {
      op.db.run(op.queryString, [], (err) => {
        QueryHelper.checkForError(rej, err, op, () => {
          QueryHelper.resolvePromise(res, null, op);
        });
      });
    });
  }

  static where (op) {
    op = QueryHelper.whereOptions(this, op);
    QueryHelper.log(op.queryString, op);
    return new Promise ((res, rej) => {
      op.db.all(op.queryString, [], (err, rows) => {
        QueryHelper.checkForError(rej, err, op, () => {
        if (rows === undefined) { rows = []; }
        op.rows = QueryHelper.parseAttributes(op.Model, rows);
          QueryHelper.resolvePromise(res, op.rows, op);
        });
      });
    });
  }

  set (op) {
    this.attributes = Object.assign(this.attributes, op);
  }
}

module.exports = DBObject;

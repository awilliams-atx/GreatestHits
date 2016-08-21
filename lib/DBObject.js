'use strict';
const sqlite3 = require('sqlite3');
const dbPath = './data.db';
const QueryHelper = require('./QueryHelper.js');

class DBObject {
  static all (op) {
    op = QueryHelper.basicOptions(this, op);
    return QueryHelper.promise(op, () => {
      op.db.all(`SELECT * FROM ${op.tableName};`, [], (err, rows) => {
        QueryHelper.checkForError(err, op, () => {
          QueryHelper.resolveAllPromise(op, rows);
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
    return QueryHelper.promise(op, () => {
      op.db.get(op.queryString, (err, record)  => {
        QueryHelper.checkForError(err, op, () => {
          QueryHelper.checkNoRecordFound(record, op, () => {
            QueryHelper.resolveFindPromise(op, record);
          });
        });
      });
    });
  }

  static insert (op) {
    op = QueryHelper.insertOptions(this, op);
    return QueryHelper.promise(op, () => {
      op.db.serialize(function () {
        let stmt = op.db.prepare(op.queryString, [], (err) => {
          QueryHelper.checkForError(err, op, () => {
            stmt.run(op.vals);
            stmt.finalize();
            QueryHelper.logInsert(stmt, op); // Logging
            op.db.get(QueryHelper.lastInsertRowIdString(op), (err, row) => {
              QueryHelper.checkForError(err, op, () => {
                QueryHelper.resolveInsertPromise(op, row);
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
    return QueryHelper.promise(op, () => {
      op.db.run(op.queryString, [], (err) => {
        QueryHelper.checkForError(err, op, () => {
          QueryHelper.resolvePromise(null, op);
        });
      });
    });
  }

  static where (op) {
    op = QueryHelper.whereOptions(this, op);
    QueryHelper.log(op.queryString, op);
    return QueryHelper.promise(op, () => {
      op.db.all(op.queryString, [], (err, rows) => {
        QueryHelper.checkForError(err, op, () => {
        if (rows === undefined) { rows = []; }
        op.rows = QueryHelper.parseAttributes(op.Model, rows);
          QueryHelper.resolvePromise(op.rows, op);
        });
      });
    });
  }

  set (op) {
    this.attributes = Object.assign(this.attributes, op);
  }
}

module.exports = DBObject;

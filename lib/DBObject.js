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
    op = QueryHelper.findOptions(this, op, id);
    QueryHelper.log(op.queryString, op);
    return QueryHelper.promise(op, () => {
      QueryHelper.dbGet(op, (err, record) => {
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
        QueryHelper.dbPrepare(op, (err) => {
          QueryHelper.checkForError(err, op, () => {
            QueryHelper.stmtRun(op);
            QueryHelper.stmtFinalize(op);
            QueryHelper.logInsert(op.stmt, op);
            QueryHelper.addLastInsertRowIdString(op);
            QueryHelper.dbGet(op, (err, row) => {
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
      QueryHelper.dbRun(op, (err) => {
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
      QueryHelper.dbAll(op, (err, rows) => {
        QueryHelper.checkForError(err, op, () => {
          QueryHelper.parseAndAddRows(rows, op);
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

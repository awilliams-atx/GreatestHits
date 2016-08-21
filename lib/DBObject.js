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
          rows = rows.map(row => {
            return QueryHelper.parseAttributes(this, row);
          });
          op.rows = rows;
          QueryHelper.resolvePromise(res, rows, op);
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
    op = QueryHelper.insertOptions(this, op);
    return new Promise ((res, rej) => {
      op.db.serialize(function () {
        let stmt = op.db.prepare(`INSERT INTO ${op.tableName} ${op.cols} VALUES ${op.questionMarks}`, [], (err) => {
          if (err) {
            op.db.close();
            rej(err);
          } else {
            stmt.run(op.vals);
            stmt.finalize();
            if (!op.quiet) { QueryHelper.logInsert(stmt, op.vals); } // Logging
            op.db.get(`SELECT last_insert_rowid() FROM ${op.tableName} LIMIT 1`, (err, row) => {
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
    op = QueryHelper.updateOptions(this, op);
    QueryHelper.log(op.queryString, op);
    return new Promise ((res, rej) => {
      op.db.run(op.queryString, [], (err) => {
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
    op = QueryHelper.whereOptions(this, op);
    QueryHelper.log(op.queryString, op);
    return new Promise ((res, rej) => {
      op.db.all(op.queryString, [], (err, rows) => {
        if (rows === undefined) { rows = []; }
        op.rows = QueryHelper.parseAttributes(this, rows);
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

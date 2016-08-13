'use strict';
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./data.db');
const QueryHelper = require('./QueryHelper.js');
const DBParse = require('./DBParse.js');

class DBObject {
  static insert (tableName, record) {
    let questionMarks = QueryHelper.questionMarks(record);
    let colsAndVals = QueryHelper.colsAndVals(record);
    let cols = colsAndVals.cols;
    let vals = colsAndVals.vals;
    let query = db.prepare(`INSERT INTO ${tableName} ${cols} VALUES ${questionMarks}`);
    query.run(vals);
    query.finalize();
    console.log(query, vals);
    db.close();
  }

  find (id) {
    let query = `SELECT * FROM ${this.tableName} WHERE id = ${id};`
    console.log(query);
    return new Promise((res, rej) => {
      db.get(query, (err, record)  => {
        db.close();
        if (err) { rej(err); }
        if (record === undefined) {
          throw 'Record undefined';
        }
        this.attributes = DBParse.attributes(record);
        res();
      });
    });
  }

  insert () {
    DBObject.insert(this.tableName, this.attributes);
  }
}

module.exports = DBObject;

'use strict';
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./data.db');
const QueryHelper = require('./QueryHelper.js');

class DBObject {
  insert () {
    let questionMarks = QueryHelper.questionMarks(arguments);
    let colsAndVals = QueryHelper.colsAndVals(arguments);
    let cols = colsAndVals.cols;
    let vals = colsAndVals.vals;
    let query = db.prepare(`INSERT INTO ${this.tableName} ${cols} VALUES ${questionMarks}`);
    console.log(query, vals);
    query.run(vals);
    query.finalize();
    db.close();
  }
}

module.exports = DBObject;

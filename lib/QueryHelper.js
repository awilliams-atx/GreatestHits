'use strict';

class QueryHelper {
  static addTimestamps (record) {
    record.createdAt = new Date();
    record.updatedAt = new Date();
  }

  static colsAndVals (record) {
    let cols = [];
    let vals = [];
    Object.keys(record).forEach(colName => {
      cols.push(colName);
      vals.push(record[colName]);
    });
    cols = `(${cols.join(', ')})`;
    return {cols, vals};
  }

  static logInsert (stmt, vals) {
    let logFront = stmt.sql.slice(0, stmt.sql.indexOf('(?'));
    let logBack = `(${vals.join(', ')})`;
    console.log(logFront + logBack);
  }

  static questionMarks (record) {
    let questionMarks = '(';
    for (var i = 0; i < Object.keys(record).length; i++) {
      questionMarks += '?, '
    }
    questionMarks = questionMarks.slice(0, questionMarks.length - 2);
    questionMarks += ')';
    return questionMarks;
  }
}

module.exports = QueryHelper;

'use strict';

class QueryHelper {
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

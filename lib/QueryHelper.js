'use strict';

class QueryHelper {
  static colsAndVals () {
    let args = arguments[0][0];
    let cols = [];
    let vals = [];
    Object.keys(args).forEach(colName => {
      cols.push(colName);
      vals.push(args[colName]);
    });
    cols = `(${cols.join(', ')})`;
    return {cols, vals};
  }

  static questionMarks () {
    let args = arguments[0][0];
    let questionMarks = '(';
    for (var i = 0; i < Object.keys(args).length; i++) {
      questionMarks += '?, '
    }
    questionMarks = questionMarks.slice(0, questionMarks.length - 2);
    questionMarks += ')';
    return questionMarks;
  }
}

module.exports = QueryHelper;

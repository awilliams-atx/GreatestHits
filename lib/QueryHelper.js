'use strict';

class QueryHelper {
  static addTimestamps (op) {
    let attributes = op.attributes ? op.attributes : op.dbObject.attributes;
    attributes.createdAt = new Date();
    attributes.updatedAt = new Date();
  }

  static colsAndVals (op) {
    let attributes = op.attributes ? op.attributes : op.dbObject.attributes;
    let cols = [];
    let vals = [];
    Object.keys(attributes).forEach(colName => {
      cols.push(colName);
      vals.push(attributes[colName]);
    });
    cols = `(${cols.join(', ')})`;
    return {cols, vals};
  }

  static logInsert (stmt, vals) {
    let logFront = stmt.sql.slice(0, stmt.sql.indexOf('(?'));
    let logBack = `(${vals.join(', ')})`;
    console.log(logFront + logBack);
  }

  static questionMarks (op) {
    let attributes = op.attributes ? op.attributes : op.dbObject.attributes;
    let questionMarks = '(';
    for (var i = 0; i < Object.keys(attributes).length; i++) {
      questionMarks += '?, '
    }
    questionMarks = questionMarks.slice(0, questionMarks.length - 2);
    questionMarks += ')';
    return questionMarks;
  }

  static selectLine (op) {
    if (!op.select) { return 'SELECT *'; }
    return `SELECT ${op.select.join(', ')}`;
  }

  static setLine (op) {
    if (!op.set) { return ''; }
    let assignments = [];
    Object.keys(op.set).forEach(col => {
      if (['id', 'createdAt'].indexOf(col) >= 0) { return; }
      if (typeof op.set[col] === 'string') {
        assignments.push(col + ' = \'' + op.set[col] + '\'');
      } else {
        assignments.push(col + ' = ' + op.set[col]);
      }
    });
    return ' SET ' + assignments.join(', ');
  }

  static toUpdateQuery (dbObject) {
    return({
      set: dbObject.attributes,
      where: { id: dbObject.id }
    });
  }

  static updateString (op) {
    let tableName = op.tableName ? op.tableName : op.dbObject.tableName;
    let query = `UPDATE ${tableName}` +
      QueryHelper.setLine(op) + ' ' +
      QueryHelper.whereLine(op) + ';';
      return query;
  }

  static updateTimestamp (op) {
    op.set.updatedAt = new Date().toString();
  }

  static whereLine (op) {
    if (!op.where) { return ''; }
    let conditions = [];
    Object.keys(op.where).forEach(col => {
      if (typeof op.where[col] === 'string') {
        conditions.push(col + ' = \'' + op.where[col] + '\'');
      } else {
        conditions.push(`${col} = ${op.where[col]}`);
      }
    });
    return ' WHERE ' + conditions.join(' AND ');
  }

  static whereString (op) {
    return `${QueryHelper.selectLine(op)} ` +
      `FROM ${op.tableName}` +
      `${QueryHelper.whereLine(op)};`
  }
}

module.exports = QueryHelper;

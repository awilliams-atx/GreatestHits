'use strict';

class QueryHelper {
  static addColsAndVals (op) {
    op.cols = [];
    op.vals = [];
    Object.keys(op.attributes).forEach(colName => {
      op.cols.push(colName);
      op.vals.push(op.attributes[colName]);
    });
    op.cols = `(${op.cols.join(', ')})`;
  }
  
  static addTimestamps (op) {
    let attributes = op.attributes ? op.attributes : op.dbObject.attributes;
    attributes.createdAt = new Date();
    attributes.updatedAt = new Date();
  }

  static basicOptions (Model, op) {
    op = op || {};
    op.tableName = Model.dbProps('tableName');
    if (!op.db) { op.db = Model.open(); }
    if (op.done === undefined) { op.done = true; }
    return op;
  }

  static extractId (op) {
    if (op.where) {
      op.id = op.where.id;
    }
  }

  static log (log, op) {
    if (!op.quiet) { console.log(log); }
  }

  static logInsert (stmt, vals) {
    let logFront = stmt.sql.slice(0, stmt.sql.indexOf('(?'));
    let logBack = `(${vals.join(', ')})`;
    console.log(logFront + logBack);
  }

  static parseAttributes (Model, result) {
    if (Array.isArray(result)) {
      let results = [];
      result.forEach(result => {
        results.push(QueryHelper.parseAttributes(Model, result));
      });
      return results;
    } else {
      let parsed = {};
      Object.keys(result).forEach(key => {
        if (['createdAt', 'updatedAt'].indexOf(key) >= 0) {
          parsed[key] = new Date(result[key]);
        } else {
          parsed[key] = result[key];
        }
      });
      return new Model(parsed);
    }
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

  static resolvePromise (resolve, result, op) {
    op = op || {};
    if (op.done) {
      op.db.close();
      if (result) {
        resolve(result);
      } else {
        resolve(op);
      }
    } else {
      resolve(op);
    }
  }

  static selectLine (op) {
    if (!op.select) { return 'SELECT *'; }
    return `SELECT ${op.select.join(', ')}`;
  }

  static setDefaults (Model, op) {
    op.attributes = Object.assign(Model.defaults(op), op.attributes);
  }

  static setLine (op) {
    if (!op.blockToString) { op.blockToString = {}; }
    if (!op.set) { return ''; }
    let assignments = [];
    Object.keys(op.set).forEach(col => {
      if (['id', 'createdAt'].indexOf(col) >= 0) { return; }
      if (typeof op.set[col] === 'string' && !op.blockToString[col]) {
        assignments.push(col + ' = \'' + op.set[col] + '\'');
      } else {
        assignments.push(col + ' = ' + op.set[col]);
      }
    });
    return ' SET ' + assignments.join(', ');
  }

  static toFind (op) {
    if (op && op.where && op.where.id) {
      op.id = op.where.id;
    }
    return op;
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

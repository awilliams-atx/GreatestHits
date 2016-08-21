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

  static addLastInsertRowIdString (op) {
    op.queryString = `SELECT last_insert_rowid() FROM ${op.tableName} LIMIT 1`;
  }

  static addQuestionMarks (op) {
    let questionMarks = '(';
    for (var i = 0; i < Object.keys(op.attributes).length; i++) {
      questionMarks += '?, '
    }
    questionMarks = questionMarks.slice(0, questionMarks.length - 2);
    questionMarks += ')';
    op.questionMarks = questionMarks;
  }

  static addTimestamps (op) {
    let attributes = op.attributes ? op.attributes : op.dbObject.attributes;
    attributes.createdAt = new Date();
    attributes.updatedAt = new Date();
  }

  static basicOptions (Model, op) {
    op = op || {};
    op.Model = Model;
    op.tableName = op.Model.dbProps('tableName');
    if (!op.db) { op.db = op.Model.open(); }
    if (op.done === undefined) { op.done = true; }
    return op;
  }

  static checkForError (err, op, cb) {
    if (err) {
      op.db.close();
      op.rej(err);
    } else {
      cb();
    }
  }

  static checkNoRecordFound (record, op, cb) {
    if (record === undefined) {
      QueryHelper.log('Record Not Found', op);
      op.db.close();
      op.res(null);
    } else {
      cb();
    }
  }

  static dbAll (op, cb) {
    op.db.all(op.queryString, [], (err, rows) => {
      cb(err, rows);
    });
  }

  static dbGet (op, cb) {
    op.db.get(op.queryString, (err, record)  => {
      cb(err, record);
    });
  }

  static dbPrepare (op, cb) {
    op.stmt = op.db.prepare(op.queryString, [], (err) => {
      cb(err);
    });
  }

  static dbRun (op, cb) {
    op.db.run(op.queryString, [], (err) => {
      cb(err);
    });
  }

  static extractId (op) {
    if (op.where) {
      op.id = op.where.id;
    }
  }

  static findOptions (Model, op, id) {
    op = QueryHelper.basicOptions(Model, op);
    op.queryString = `SELECT * FROM ${op.tableName} WHERE id = ${id};`
    return op;
  }

  static insertOptions (Model, op) {
    op = QueryHelper.basicOptions(Model, op);
    QueryHelper.addTimestamps(op);
    QueryHelper.setDefaults(Model, op);
    QueryHelper.addQuestionMarks(op);
    QueryHelper.addColsAndVals(op);
    op.queryString = `INSERT INTO ${op.tableName} ${op.cols} VALUES ${op.questionMarks}`;
    return op;
  }

  static log (log, op) {
    if (!op.quiet) { console.log(log); } // Logging
  }

  static logInsert (stmt, op) {
    if (op.quiet) { return; }
    let logFront = stmt.sql.slice(0, stmt.sql.indexOf('(?'));
    let logBack = `(${op.vals.join(', ')})`;
    console.log(logFront + logBack); // Logging
  }

  static parseAttributes (result, op) {
    result = result || [];
    if (Array.isArray(result)) {
      let results = [];
      result.forEach(result => {
        results.push(QueryHelper.parseAttributes(result, op));
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
      return new op.Model(parsed);
    }
  }

  static promise (op, cb) {
    return new Promise((res, rej) => {
      op.res = res;
      op.rej = rej;
      cb();
    });
  }

  static resolveAllPromise (op, rows) {
    rows = rows.map(row => {
      return QueryHelper.parseAttributes(row, op);
    });
    op.rows = rows;
    QueryHelper.resolvePromise(rows, op);
  }

  static resolveFindPromise (op, record) {
    QueryHelper.log('1 Record Retrievied', op);
    op.dbObject = QueryHelper.parseAttributes(record, op);
    QueryHelper.resolvePromise(op.dbObject, op);
  }

  static resolveInsertPromise (op, row) {
    op.id = row['last_insert_rowid()'];
    QueryHelper.resolvePromise(null, op);
  }

  static resolvePromise (result, op) {
    op = op || {};
    if (op.done) {
      op.db.close();
      if (result) {
        op.res(result);
      } else {
        op.res(op);
      }
    } else {
      op.res(op);
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

  static updateOptions (Model, op) {
    op = QueryHelper.basicOptions(Model, op);
    QueryHelper.updateTimestamp(op);
    QueryHelper.extractId(op);
    op.queryString = QueryHelper.updateString(op);
    return op;
  }

  static updateString (op) {
    let query = `UPDATE ${op.tableName}` +
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

  static whereOptions (Model, op) {
    op = QueryHelper.basicOptions(Model, op);
    op.queryString = QueryHelper.whereString(op);
    return op;
  }

  static whereString (op) {
    return `${QueryHelper.selectLine(op)} ` +
      `FROM ${op.tableName}` +
      `${QueryHelper.whereLine(op)};`
  }
}

module.exports = QueryHelper;

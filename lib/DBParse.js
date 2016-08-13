'use strict';

class DBParse {
  static attributes (record) {
    let parsed = {};
    Object.keys(record).forEach(key => {
      if (['createdAt', 'updatedAt'].indexOf(key) >= 0) {
        parsed[key] = new Date(record[key]);
      } else {
        parsed[key] = record[key];
      }
    });
    return parsed;
  }
}

module.exports = DBParse;

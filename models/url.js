'use strict';
const DBObject = require('../lib/DBObject.js');
const Crypto = require('crypto');

class Url extends DBObject {
  constructor (attributes) {
    super();
    this.tableName = 'urls';
    this.attributes = attributes || {};
  }

  static AvailableRandomString (op) {
    let string = Crypto.randomBytes(6).toString('hex');
    return new Promise((res, rej) => {
      Url.where({
        tableName: 'urls',
        where: { short: string },
        db: op ? op.db : undefined,
        done: false,
        quiet: true
      }).then(op => {
        if (op.rows.length === 0) {
          op.db.close();
          res(string);
        } else {
          return Url.AvailableRandomString(op);
        }
      }).catch(err => {
        console.error(err);
        rej(err);
      });
    });
  }
}

module.exports = Url;

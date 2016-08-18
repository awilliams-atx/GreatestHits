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

  static dbProps (prop) {
    switch (prop) {
    case 'tableName':
      return 'urls';
      break;
    }
  }

  static defaults (op) {
    let short = op.attributes.short;
    short = (short.match(/^\//)) ? short : '/' + short;
    op.attributes.short = short;
    return {
      short,
      desktopHits: 0,
      mobileHits: 0,
      tabletHits: 0,
      desktopRedirects: 0,
      mobileRedirects: 0,
      tabletRedirects: 0
    };
  }
}

module.exports = Url;

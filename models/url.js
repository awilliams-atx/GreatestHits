'use strict';
const DBObject = require('../lib/DBObject.js');

class Url extends DBObject {
  constructor (attributes) {
    super();
    this.tableName = 'urls';
    this.attributes = attributes || {};
  }
}

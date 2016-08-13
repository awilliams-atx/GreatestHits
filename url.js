'use strict';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

class Url {
  constructor (options) {
    this.tableName = options.tableName;
  }
  find (id) {
    let query = `SELECT * FROM ${this.tableName};`;
    db.each(query, function (err, rows) {
      console.log(rows);
    });
    db.close();
  }
}

var url = new Url({tableName: 'urls'});
url.find(1);

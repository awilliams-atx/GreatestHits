'use strict';

const Url = require('../models/Url.js');

let urls = [];

// ALL

let imaginaming = {
  desktop: 'https://www.imaginaming.com',
  mobile: 'https://www.imaginaming.com/mobile',
  tablet: 'https://www.imaginaming.com/tablet'
};

urls.push(imaginaming);

let dynamike = {
  desktop: 'https://www.dynamike.com',
  mobile: 'https://www.dynamike.com/mobile',
  tablet: 'https://www.dynamike.com/tablet'
};

urls.push(dynamike);

// NO TABLET

let google = {
  desktop: 'https://www.google.com/maps',
  mobile: 'https://www.google.com/maps/@'
};

urls.push(google);

let evernote = {
  desktop: 'https://www.evernote.com/?var=c',
  mobile: 'https://www.evernote.com/?var=1'
};

urls.push(evernote);

// NO MOBILE

let dreamscheme = {
  desktop: 'https://www.dreamscheme.com',
  tablet: 'https://www.dreamscheme.com/tablet'
};

urls.push(dreamscheme);

// NO DESKTOP

let nycLifts = {
  mobile: 'https://www.nycLifts.com/mobile',
  tablet: 'https://www.nycLifts.com/tablet'
};

urls.push(nycLifts);

// DB INSERTION

let idx = 0;

function insert () {
  Url.availableRandomString()
    .then(str => {
      return Url.insert({
        attributes: Object.assign(urls[idx], {short: str}),
        quiet: true
      });
    })
    .then(url => {
      idx += 1;
      if (idx < urls.length) {
        insert(urls[idx]);
      }
    })
    .catch(err => {
      console.error(err);
    })
};

insert(urls);

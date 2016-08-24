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

let orangeSoda = {
  desktop: 'https://www.orangeSoda.com',
  mobile: 'https://www.orangeSoda.com/mobile',
  tablet: 'https://www.orangeSoda.com/tablet'
};

urls.push(orangeSoda);

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

let notebookJeans = {
  desktop: 'https://www.notebookJeans.com/?var=c',
  mobile: 'https://www.notebookJeans.com/?var=1'
};

urls.push(notebookJeans);

// NO MOBILE

let dreamscheme = {
  desktop: 'https://www.dreamscheme.com',
  tablet: 'https://www.dreamscheme.com/tablet'
};

urls.push(dreamscheme);

let cordlessFuture = {
  desktop: 'https://www.cordlessFuture.com',
  tablet: 'https://www.cordlessFuture.com/tablet'
};

urls.push(cordlessFuture);

// NO DESKTOP

let nycLifts = {
  mobile: 'https://www.nycLifts.com/mobile',
  tablet: 'https://www.nycLifts.com/tablet'
};

urls.push(nycLifts);

let sweetHomeNetwork = {
  mobile: 'https://www.sweetHomeNetwork.com/mobile',
  tablet: 'https://www.sweetHomeNetwork.com/tablet'
};

urls.push(sweetHomeNetwork);

// DB INSERTION

let idx = 0;

function insert (cb) {
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
        return insert(cb);
      } else {
        cb()
      }
    })
    .catch(err => {
      console.error(err);
    })
};

insert(() => {
  idx = 0;
  randomUpdates();
});

let cols = [ 'desktopHits', 'mobileHits', 'tabletHits', 'desktopRedirects', 'mobileRedirects', 'tabletRedirects'];

function randomUpdates () {
  let id = Math.floor(Math.random() * urls.length) + 1;
  let col = cols[Math.floor(Math.random() * cols.length)];
  let setOptions = {};
  setOptions[col] = col + ' + 1';
  let blockToString = {};
  blockToString[col] = true;
  Url.update({
    where: { id: id},
    set: setOptions,
    blockToString: blockToString,
    quiet: true
  })
    .then(() => {
      idx += 1;
      if (idx < 200) {
        randomUpdates();
      }
    })
    .catch(err => {
      console.error(err);
    });
};

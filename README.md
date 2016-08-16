# GreatestHits

GreatestHits is an ad-tech URL shortener and management system. Star features include:

* JSON API.
* URL age and number of requests tracked based on requesting device type.
* Mobile, Tablet, and Desktop device detection* service redirects to separate configurable long URLs.

#### Future of GreatestHits

* Aggregate routes like `GET /most_popular_mobile`

#### Set up (Mac)

* [Install SQLite](http://www.tutorialspoint.com/sqlite/sqlite_installation.htm)
* From the root directory, run `./import_db.sh` to set up the database.
* [Install Node.js](https://nodejs.org/en/download/)
* From the root directory, run `npm start`

#### Routes

You're up and running! The following routes are now available:

* `GET /urls` -> All URLs
* `GET /url/:id` -> Find URL by ID
* `POST /urls` -> Create new URL*
* `GET /*` -> Wildcard*

The URL creation route, `POST /urls`, will create a shortened URL in the database and store URLs passed in via the query string or request body. Available fields include `desktop`, `mobile`, and `tablet`.

The wildcard route, `GET /*`, will try to match the provided pathname to a URL from the database. If a match is found, the response will be a 302 (redirect) with a location which is set up by accessing `POST /urls`. In the event that request comes from a mobile or tablet user for a URL **but the URL for that device type is unavailable**, the default location will be `desktop`. If that is unavailable, the response will be a `404 Not Found`.

#### Testing

From the root directory, run `npm test`.

###### Resources

- [express](http://expressjs.com/) (Back End Node framework)
- [express-device](https://github.com/rguerreiro/express-device) (Useragent device detector)
- [mocha](https://mochajs.org/) (Testing)
- [chai](chaijs.com) (Testing)
- [chai-as-promised](https://github.com/domenic/chai-as-promised) (Testing)
- [mockery](https://github.com/mfncooper/mockery) (Testing)
- [supertest](https://github.com/visionmedia/supertest) (Testing)
- [node-sqlite3](https://github.com/mapbox/node-sqlite3/wiki/API) (Sqlite3 Node module)

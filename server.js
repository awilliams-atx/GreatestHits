const app = require('./app')({});

const server = app.listen(3000, () => {
  console.log('Server listening on port ' + server.address().port); // Logging
});

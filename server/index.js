var express = require('express');
var fs = require('fs');
var secrets = require('./config/secrets');

var app = express();

// Find the appropriate database to connect to, default to localhost if not found.

// Bootstrap models
// fs.readdirSync(__dirname + '/models').forEach(function(file) {
//   if(~file.indexOf('.js')) require(__dirname + '/models/' + file);
// });

// Bootstrap passport config

// Bootstrap application settings
require('./config/express')(app);
// Bootstrap routes
require('./config/routes')(app);


app.listen(app.get('port'));

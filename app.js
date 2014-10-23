var express     = require('express');
var path        = require('path');

BASE = function(p) { return path.join(__dirname, p); };

var settings    = require('./src/config/settings');
var routes      = require('./src/config/routes');
var environment = require('./src/config/environment');

var app = express();

environment(app);
routes(app);

app.listen(settings.port);
console.log('Server started... listening on port' + settings.port)

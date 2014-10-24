var express = require('express');
var path = require('path');
var orm = require('orm');

// naughty global for making non-relative imports
BASE = function(p) { return path.join(__dirname, p); };

var settings = require('./src/config/settings');
var mainRouter = require('./src/config/routes');
var environment = require('./src/config/environment');
var db = require('./src/config/db')

var app = express();

// middlewares must be added in order - start with the basics
environment(app);

// add models to the request early in the middleware chain
var dbConn = orm.connect(settings.db, function(err){
  if (err) return console.error('DB Connection error: ' + err);
  else{
    app.use(function(req,res,next){
      models = db.init(dbConn);
      req.models = models;
      next();
    });
  }
});

// add all the main routes
app.use(mainRouter);

app.listen(settings.port);
console.log('Server started... listening on port' + settings.port)

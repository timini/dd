var express = require('express');
var path = require('path');
var orm = require('orm');

var settings = require('./config/settings');
var mainRouter = require('./config/routes');
var environment = require('./config/environment');
var db = require('./config/db')

var app = express();

// middlewares must be added in order - start with the basics
environment(app);

// add models to the request early in the middleware chain
var dbConn = orm.connect(settings.db, function(err){
  if (err) return console.error('DB Connection error: ' + err);
  else{
    models = db.init(dbConn);
    app.use(function(req,res,next){
      req.models = models;
      next();
    });
    // add all the main routes
    app.use(mainRouter);
  }
});

app.listen(settings.port);
console.log('Server started... listening on port ' + settings.port)

module.exports = app;

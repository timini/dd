var express = require('express');
var path = require('path');
var orm = require('orm');

var settings = require('./backend/config/settings');
var mainRouter = require('./backend/config/routes');
var environment = require('./backend/config/environment');
var db = require('./backend/config/db')

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

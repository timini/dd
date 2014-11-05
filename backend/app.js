var express = require('express');
var path = require('path');
var orm = require('orm');

var settings = require('./config/settings');
var mainRouter = require('./config/routes');
var environment = require('./config/environment');
var db = require('./config/db');
var auth = require('./modules/auth');

var app;

module.exports = function(cb){
  app = express();

  // middlewares must be added in order - start with the basics
  environment(app);
  if (process.env.TESTING) { dbSettings = settings.dbTesting; }
  else { dbSettings = settings.db; }

  // add models to the request early in the middleware chain
  dbConn = orm.connect(dbSettings, function(err){
    if (err) return console.error('DB Connection error: ' + err);
    else{
      models = db.init(dbConn);
      app.use(function(req,res,next){
        req.models = models;
        next();
      });

      passport = auth.init(this.models);
      authRouter = auth.router(passport)

      app.use('/users', authRouter);
      app.use(mainRouter);

      cb({
          dbConn: dbConn,
          app: app,
          models: models
      });
    }
  });
}

if (!process.env.TESTING) {
  module.exports(function(server){
    server.app.listen(settings.port);
    console.log('Server started... listening on port ' + settings.port)
  });
}

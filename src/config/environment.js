var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var logger          = require('morgan');

module.exports = function(app){
  app.set('views', '../views');
  app.set('view engine', 'jade');

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(function(req,res,next){
    models(function(err,db){
      if (err) return next(err);

      req.models = db.models;
      req.db = db;

      return next();
    });
  });
}

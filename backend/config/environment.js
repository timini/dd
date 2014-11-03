var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport')

module.exports = function(app){
  app.set('views', './backend/views');
  app.set('view engine', 'jade');

  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(session({secret: 'lalala', 
                   saveUninitialized: true,
                   resave: true}));
  app.use(passport.initialize());
  app.use(passport.session());

  // dev stuff
  app.use(logger('dev'));
  app.use(require('connect-livereload')());
}

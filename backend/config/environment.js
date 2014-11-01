var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

module.exports = function(app){
  app.set('views', './backend/views');
  app.set('view engine', 'jade');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  // dev stuff
  app.use(logger('dev'));
  app.use(require('connect-livereload')());
}

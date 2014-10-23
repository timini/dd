var express     = require('express');
var path        = require('path');
var orm         = require('orm');

BASE = function(p) { return path.join(__dirname, p); };

var settings    = require('./src/config/settings');
var main_router = require('./src/config/routes');
var environment = require('./src/config/environment');
var db          = require('./src/config/db')


var app = express();

// middlewares must be added in order
environment(app);

models = db.init(db_conn);

// add models to the request early in the middleware chain
var db_conn = orm.connect(settings.db, function(err){
    if (err) return console.error('DB Connection error: ' + err);
    else{
        app.use(function(req,res,next){
            req.models = models;
            next();
        });
    }
});

app.use(main_router);

app.listen(settings.port);
console.log('Server started... listening on port' + settings.port)

var express     = require('express')
var favicon     = require('serve-favicon');

var controllers = require(BASE('/src/controllers'));

module.exports = function(app){
    app.get('/'                     , controllers.home);
//   app.get('/users/login'          , controllers.users.login);
//    app.get('/users/logout'         , controllers.users.logout);
//    app.get('/data'                 , controllers.data.list);
//    app.get('/data/:product_group'  , controllers.data.get);

    app.use('/js'                   , express.static(BASE('build/js')));
    app.use('/css'                  , express.static(BASE('build/css')));
    app.use('/resources'            , express.static(BASE('resources')));
    app.use(favicon(BASE('/resources/favicon.ico')));
};

R = require('ramda');
async = require("async");

models = require('../models');

module.exports.init = function(dbConn){
  var build_model = function(model) { return model(dbConn); }
  return R.mapObj(build_model, models);
}

var syncModel = function(model, cb){
    model.sync(function(err){
      if (err) { throw err }
      console.log('model synced')
      cb()
    })
}

module.exports.sync = function(models, cb){
    async.eachSeries(Object.keys(models), function(key, callback){
        console.log('syncing ' + key)
        syncModel(models[key], callback)
    }, function(err){
        if (err){ throw err }
        console.log('syncing complete')
        cb()
    })
}

R = require('ramda');

models = require('../models');

module.exports.init = function(dbConn){
  var build_model = function(model) { return model(dbConn); }
  return R.mapObj(build_model, models);
}

var syncModel = function(model, cb){
  model.sync(function(err){
    if (err) console.log('error syncing ' + model);
    else console.log('syncing complete for ' + model);
    cb()
  });
}

module.exports.sync = function(models, cb){
  Object.keys(models).forEach(function(key){
    console.log('syncing ' + key);
    models[key].sync(function(err){
      if (err) console.log('error syncing ' + key);
      else console.log('syncing complete for ' + key);
    });
  });
  cb()
}

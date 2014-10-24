R = require('ramda');

models = require('../models');

module.exports.init = function(dbConn){
  return R.mapObj(
    function(model) { return model(dbConn); },
    models
  );
}

module.exports.sync = function(models){
  for (var model in models){
    console.log('syncing ' + model);
    models[model].sync(function(err){
      if (err) console.log('error syncing ' + model);
      else console.log('syncing complete for ' + model);
    });
  }
}

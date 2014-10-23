R       = require('ramda');

models  = require(BASE('/src/models'));

module.exports.init = function(db_conn){
    return R.mapObj(function(model) {
        return models[model](db_conn);
    });
}

module.exports.sync = function(models){
    for (var model in models){
        console.log('syncing ' + model);
        models[model].sync(function(err){
            if (err) { console.log('error syncing ' + model); }
            else { console.log('syncing complete for ' + model); }
        });
    }
}

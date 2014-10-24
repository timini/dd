R       = require('ramda');

models  = require(BASE('/src/models'));


module.exports.init = function(db_conn){
    var build_model = function(model) {
        return model(db_conn);
    }
    return R.mapObj(build_model, models);
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

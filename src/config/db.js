models = require(BASE('/src/models'));

module.exports.init = function(db_conn){
    Models = {};
    for (var model in models){
        Model = models[model](db_conn);
        Models[model] = Model;
    }
    return Models;
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

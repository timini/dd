models = require(BASE('/src/models'));

module.exports.init = function(db_conn){
    for (var model in model){
        models[model](db_conn);
    }
    return models;
}

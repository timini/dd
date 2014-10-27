var rest = require('./rest');
var models = require('../models')

module.exports = rest(models.product);

var express = require('express');
var path = require('path');

var controllers = require('../controllers');

var router = express.Router();

var rootPath = path.dirname(require.main.filename) + '/../';

router.get('/', controllers.home);
router.use('/products', controllers.products);
router.use('/js', express.static(rootPath + 'build/js'));
router.use('/css', express.static(rootPath + 'build/css'));
router.use('/resources', express.static(rootPath + 'resources'));

module.exports = router;

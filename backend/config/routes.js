var express = require('express');
var path = require('path');

var controllers = require('../controllers');

var router = express.Router();

var rootPath = path.dirname(require.main.filename);

router.get('/', controllers.home);
router.get('/user/login', controllers.users.login);
router.get('/user/logout', controllers.users.logout);
router.post('/user/create', controllers.users.create);
router.get('/product', controllers.product.list);
router.get('/product/:product_group', controllers.product.get);
router.use('/js', express.static(rootPath + '/build/js'));
router.use('/css', express.static(rootPath + '/build/css'));
router.use('/resources', express.static(rootPath + '/resources'));

module.exports = router;

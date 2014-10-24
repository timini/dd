var express     = require('express')

var controllers = require('../controllers');

var router = express.Router();

router.get('/', controllers.home);
router.get('/user/login', controllers.users.login);
router.get('/user/logout', controllers.users.logout);
router.post('/user/create', controllers.users.create);
router.get('/product', controllers.product.list);
router.get('/product/:product_group', controllers.product.get);
router.use('/js', express.static(__dirname + '/build/js'));
router.use('/css', express.static(__dirname + '/build/css'));
router.use('/resources', express.static(__dirname + '/resources'));

module.exports = router;

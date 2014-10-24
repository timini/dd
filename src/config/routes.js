var express     = require('express')

var controllers = require(BASE('/src/controllers'));

var router = express.Router();

router.get('/'                     , controllers.home);
router.get('/users/login'          , controllers.users.login);
router.get('/users/logout'         , controllers.users.logout);
router.post('/users/create'        , controllers.users.create);
router.get('/data'                 , controllers.data.list);
router.get('/data/:product_group'  , controllers.data.get);
router.use('/js'                   , express.static(BASE('build/js')));
router.use('/css'                  , express.static(BASE('build/css')));
router.use('/resources'            , express.static(BASE('resources')));
router.use(favicon(BASE('/resources/favicon.ico')));

module.exports = router;

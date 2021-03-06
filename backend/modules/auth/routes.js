

var express = require('express');

var router = express.Router();

module.exports = function(passport){

  /* GET login page. */
  router.get('/', function(req, res) { res.send('login form'); });
  /* Handle Login POST */
  router.post('/login', passport.authenticate('login'));
  /* GET Registration Page */
  /* Handle Registration POST */
  router.post('/create', passport.authenticate('register'),  function(req, res) {
    data = {
      username: req.user.username,
      id: req.user.id,
      email: req.user.email
    }
    res.json(data);
  });

  return router;
}

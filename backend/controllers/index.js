module.exports = {
  home : require('./home'),
  users: require('./users'),
  products: require('./product'),
  echo: function(req,res, next){
    res.send(req.body);
    next();
  }
}

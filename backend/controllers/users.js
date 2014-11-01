module.exports = {
  login:function(req,res,next){
    next();
  },
  logout:function(req,res,next){
    next();
  },
  create:function(req,res,next){
    req.models.User.create(req.body, function(err,obj){
        if (err) { next(err) }
        res.json(obj);
        next()
    });
  },
}

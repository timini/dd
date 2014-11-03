var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
}

var createHash = function(password){
 return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports = function(models){
  passport.use('login', new LocalStrategy({
          usernameField : "email",
          passwordField : "password",
          passReqToCallback : true
      },
      function(req, email, password, done) {
        models.User.findOne({ email: email }, function (err, user) {
          if (err) { return done(err); }
          if (!user) { // user not found
              return done(null, false, { errors:{email:"This email address isn't registered"} });
          }
          if ( !isValidPassword(user, password) ){
            return done(null, false, {errors:{password:"Password Incorrect"}});
          }
          return done(null);
        });
      }
  ));
  passport.use('register', new LocalStrategy({
      passReqToCallback : true
    },
    function(req, username, password, done) {
      findOrCreateUser = function(){
        models.User.find({username:username},function(err, user) {
          if (err){
            console.log('Error in SignUp: '+err);
            return done(err);
          }
          if (user) {
            console.log('User already exists');
            return done(null, false);
          } else {
            userData =  {
              username : username,
              password : createHash(password),
              email : req.param('email'),
              firstName : req.param('firstName'),
              lastName : req.param('lastName'),
            }
            models.User.create(userData, function(err,obj){
               if (err) { throw err; }
               return done(null, obj);
            });
          }
        });
      }
      // Delay the execution of findOrCreateUser and execute 
      // the method in the next tick of the event loop
      process.nextTick(findOrCreateUser);
    }
  ));

  return passport;
}

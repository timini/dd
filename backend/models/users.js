module.exports = function(db) {
  var User = db.define(
    'user',
    {
      email     : String,
      password  : String,
      firstname : String,
      lastname  : String,
      karma     : Number,
      varna     : ['shudra','vasishya','kshatriya','brahmin'],
    },
    {
      methods: {
        fullName: function () {
          return this.firstname + ' ' + this.lastname;
        }
      },
      validations: {
      }
    }
  );
  return User;
}

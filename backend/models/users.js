orm = require('orm');

module.exports = function(db) {
  var User = db.define(
    'user',
    {
      email     : { type: "text", unique: true, required: true },
      password  : { type: "text", size: 55 },
      username  : { type: "text", size: 55, unique:true },
      firstName : { type: "text", size: 55 },
      lastName  : { type: "text", size: 55 },
      karma     : { type: "integer", default: 0 },
      varna     : {
                    type: "enum",
                    values:['shudra','vasishya','kshatriya','brahmin'],
                    default:"shudra"
                  },
    },
    {
      methods: {
        fullName: function () {
          return this.firstname + ' ' + this.lastname;
        }
      },
      validations: {
        email : orm.validators.patterns.email( 'invalid email' ),
      }
    }
  );
  return User;
}

var orm = require('orm');
var path = require('path');
var dbConfig = require(path.join(__base,'config/db');


var User = db.define('user', {
    firstname : String,
    lastname  : String,
    karma     : Number,
    varna     : ['shudra','vasishya','kshatriya','brahmin'],
}, {
    methods: {
        fullName: function () {
            return this.firstname + ' ' + this.lastname;
        }
    },
    validations: {
    }
});

module.exports = User;

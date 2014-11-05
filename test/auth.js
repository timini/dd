var assert = require('assert')
var should = require('should')
var request = require('supertest')

var db = require('../backend/config/db')
var settings = require('../backend/config/settings');


describe('Authentication API', function(){
  var app = null;
  var dbConn = null;
  var models = null;

  before(function(done){
    process.env['TESTING'] = true;
    require('../backend/app')(function(server){
      app = server.app
      dbConn = server.dbConn
      models = server.models
      app.listen(settings.port);
      console.log('Server started... listening on port ' + settings.port)
      done()
    });
  })

  beforeEach(function(done){
    console.log('cleaning test db..');
    dbConn.drop(function(){
      console.log('tables dropped..');
      db.sync(models, done);
    })
  })

  it('should create a new user', function(done){
    var params = {
      username : 'JimJam',
      email : 'test@example.com',
      password : 'letmein',
      firstName : 'Jim',
      lastName : 'Creek',
    }
    request(app)
    .post('/users/create')
    .send(params)
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res){
      if(err){
        done(err)
      }
      //console.log(res.body)
      res.body.should.have.property('id')
      res.body.should.not.have.property('password')
      res.body.email.should.equal(params.email)
      done()
    })
  })
})

var assert = require('assert')
var should = require('should')
var request = require('supertest')

var app = require('../backend/app')

describe('Authentication API', function(){
    it('should create a new user', function(done){
        var params = {
            email : 'test@example.com',
            password : 'letmein',
            firstname : '',
            lastname : '',
        }
        request(app)
            .post('/users/create')
            .send(params)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res){
                if(err){
                    throw err
                }
                console.log(res.body)
                res.body.should.have.property('id')
                res.body.firstname.should.equal('')
                res.body.email.should.equal(params.email)
                done()
            })
    })
})


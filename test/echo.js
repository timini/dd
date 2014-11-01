var assert = require('assert')
var should = require('should')
var request = require('supertest')

var app = require('../backend/app')


describe('POST /echo', function(){
    it('should echo data', function(done){
        var data = {
            la: 1,
            al: 2
        }
        request(app)
            .post('/echo')
            .send(data)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res){
                if (err){ throw err; }
                res.body.la.should.equal(data.la)
                res.body.al.should.equal(data.al)
                done()
            })
    });
});

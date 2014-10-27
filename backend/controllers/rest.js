var express = require('express');


module.exports = function(model){
    var router = express.Router()
    // CREATE -----------
    router.post(function(req, res, next){
        // create ned productlist
        next()
    })
    // READ -------------
    router.get(function(req, res, next){
        // list all
        next()
    })
    router.get(':id', function(req, res, next){
        // details
        next()
    })
    // UPDATE -----------
    router.put(function(req, res, next){
        // bulk update
        next()
    })
    router.put(':id', function(req, res, next){
        // update instance
        next()
    })
    // DELETE -----------
    router.delete(function(req, res, next){
        // delete whole list
        next()
    })
    router.delete(':id', function(req, res, next){
        // delete instance
        next()
    })
    return router
}

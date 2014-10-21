var EventEmitter = require('events').EventEmitter;
var R = require('ramda');
var merge = require('react/lib/merge');

var DataType = require('./datatype');

var hoveredItem = null;

var DataStore = merge(EventEmitter.prototype, {

});

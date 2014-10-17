/** @jsx React.DOM */

var React = require('react');
var $ = require('jquery');
var R = require('ramda');

var DataStore = require('./datastore');
var Table = require('./components/table');
var FilterWidget = require('./components/filter');

var App = React.createClass({

  render: function() {
    return <div><FilterWidget/><Table/></div>;
  }
});

$(function() {
  React.renderComponent(<App/>, document.getElementById("mountNode"));
});

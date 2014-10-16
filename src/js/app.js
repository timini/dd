/** @jsx React.DOM */

var React = require('react');
var $ = require('jquery');
var R = require('ramda');

var cities = require('./cities');
var Table = require('./table');
var DataStore = require('./datastore');
var CategoryFilter = require('./ui').CategoryFilter;
var FilterWidget = require('./ui').FilterWidget;

var App = React.createClass({
  render: function() {
    return (
      <div>
        <FilterWidget schema={this.props.schema}/>
        <Table schema={this.props.schema}/>
      </div>
    );
  }
});

$(function() {
  React.renderComponent(
    <App schema={cities.schema}/>,
    document.getElementById("mountNode")
  );
});

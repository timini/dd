/** @jsx React.DOM */

var React = require('react');
var $ = require('jquery');
var R = require('ramda');

var cities = require('./cities');
var Table = require('./table');
var DataStore = require('./datastore');
var CategoryFilter = require('./ui').CategoryFilter;
var FilterComponent = require('./ui').FilterComponent;

var App = React.createClass({
  render: function() {
    return (
      <div>
        <FilterComponent schema={this.props.schema}/>
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

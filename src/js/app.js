/** @jsx React.DOM */

var React = require('react');
var $ = require('jquery');
var cities = require('./cities');
var Table = require('./table');
var DataStore = require('./datastore');

var App = React.createClass({
  render: function() {
    return (
      <div>
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

  DataStore.setFilter('country', 'China');
  DataStore.setRangeFilter('area_km2', 3000, 8000);
  DataStore.setSortMethod('city', true);
});

/** @jsx React.DOM */

var React = require('react');
var $ = require('jquery');
var R = require('ramda');

var DataStore = require('./datastore');
var Table = require('./components/table');
var FilterWidget = require('./components/filterwidget');

var App = React.createClass({

  componentDidMount: function() {
    loadTestData();
  },

  render: function() {
    return (
      <div className="row collapse">
        <div className="large-4 columns">
          <h1>drilldown</h1>
          <FilterWidget/>
        </div>
        <div className="large-8 columns">
          <Table/>
        </div>
      </div>
    );
  }
});

function loadTestData() {
  var cities = require('./testdata/cities');
  DataStore.load(cities.schema, cities.items, 'population', true);
}

loadTestData();

$(function() {
  React.renderComponent(<App/>, document.getElementById("mountNode"));
});

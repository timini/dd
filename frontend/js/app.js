/** @jsx React.DOM */

var React = require('react');
var $ = require('jquery');
var R = require('ramda');

var DataStore = require('./stores/datastore');
var Table = require('./components/table');
var FilterBox = require('./components/filterbox');

//-----------------------------------------------------------------------------

var App = React.createClass({

  componentDidMount: function() {
    loadTestData();
  },

  render: function() {
    return (
      <div className="row collapse">
        <div className="large-4 columns">
          <h1>drilldown</h1>
          <FilterBox/>
        </div>
        <div className="large-8 columns">
          <Table/>
        </div>
      </div>
    );
  }
});

function loadTestData() {
  var cities = require('./utils/testdata/cities');
  DataStore.load(cities.schema, cities.items, cities.displayed, 
      'population', true);
}

loadTestData();

$(function() {
  React.renderComponent(<App/>, document.getElementById("mountNode"));
});

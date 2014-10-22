/** @jsx React.DOM */

var React = require('react');

var DataType = require('../datatype');
var DataStore = require('../datastore');
var ChangeEvent = require('../changeevent');
var CategoryFilter = require('./categoryfilter');
var NumberFilter = require('./numberfilter');

var FilterWidget = React.createClass({

  getInitialState: function() {
    return {schema: [], items: []}
  },

  componentDidMount: function() {
    DataStore.on(ChangeEvent.SCHEMA, this.onChange);
  },

  componentWillUnmount: function() {
    DataStore.removeListener(ChangeEvent.SCHEMA, this.onChange);
  },

  onChange: function(data) {
    this.setState(data);
  },

  render: function() {
    var els = [];
    this.state.schema.forEach(function(column, i) {
      switch (column.datatype) {
        case DataType.CATEGORY:
          var el = <CategoryFilter key={column.key}/>; break;
        case DataType.NUMBER:
          var el = <NumberFilter key={column.key}/>; break;
        default: return;
      }
      els.push(
        <div key={i} className="large-6 columns">
          <h5>{column.name}</h5>
          {el}
        </div>
      );
    });
    return <div className="row collapse">{els}</div>;
  },
});

module.exports = FilterWidget;

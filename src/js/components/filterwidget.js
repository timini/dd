/** @jsx React.DOM */

var React = require('react');

var DataStore = require('../stores/datastore');
var DataType = require('../consts/datatype');
var ChangeEvent = require('../consts/changeevent');
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
    this.state.schema.forEach(function(field, i) {
      switch (field.datatype) {
        case DataType.CATEGORY:
          var el = <CategoryFilter fieldKey={field.key}/>; break;
        case DataType.NUMBER:
          var el = <NumberFilter fieldKey={field.key}/>; break;
        default: return;
      }
      els.push(
        <div key={i} className="row">
          <h5>{field.name}</h5>
          {el}
        </div>
      );
    });
    return <div className="row collapse">{els}</div>;
  },
});

module.exports = FilterWidget;

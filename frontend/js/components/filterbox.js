/** @jsx React.DOM */

var React = require('react');

var DataStore = require('../stores/datastore');
var DataType = require('../consts/datatype');
var ChangeEvent = require('../consts/changeevent');
var CategoryFilter = require('./categoryfilter');
var NumberFilter = require('./numberfilter');

//-----------------------------------------------------------------------------

var FilterBox = React.createClass({

  getInitialState: function() {
    return { displayed: [], schema: {} };
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
    this.state.displayed.forEach(function(key, i) {
      var field = this.state.schema[key];
      switch (field.datatype) {
        case DataType.CATEGORY:
          var el = <CategoryFilter fieldKey={key}/>; break;
        case DataType.NUMBER:
          var el = <NumberFilter fieldKey={key}/>; break;
        default: return;
      }
      els.push(
        <div key={i} className="row">
          <h5>{field.name}</h5>
          {el}
        </div>
      );
    }, this);
    return <div className="row collapse">{els}</div>;
  },
});

module.exports = FilterBox;

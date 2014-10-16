/** @jsx React.DOM */

var React = require('react');
var DataStore = require('./datastore');

var Table = React.createClass({
  componentDidMount: function() {
    DataStore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function() {
    DataStore.removeChangeListener(this.onChange);
  },
  onChange: function() {
    this.setState(DataStore.getDataView());
  },
  getInitialState: DataStore.getDataView,
  render: function() {
    var rows = this.state.data.map(function(row) {
      return <DataRow schema={this.props.schema} data={row}/>;
    }, this);
    return (
      <table>
        <thead><HeaderRow schema={this.props.schema}/></thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
});

var HeaderRow = React.createClass({
  render: function() {
    var row = this.props.schema.map(function(column) {
      return <th>{column.name}</th>
    });
    return <tr>{row}</tr>;
  }
});

var DataRow = React.createClass({
  render: function() {
    var row = this.props.schema.map(function(column) {
      var val = this.props.data[column.id];
      var empty = val===undefined || val===null;
      return empty ? 
        <td className="empty">empty</td> :
        <td>{this.props.data[column.id]}</td>
    }, this);
    return <tr>{row}</tr>;
  }
});

module.exports = Table;

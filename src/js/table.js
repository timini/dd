/** @jsx React.DOM */

var React = require('react');
var R = require('ramda');
var DataStore = require('./datastore');

var Table = React.createClass({

  componentDidMount: function() {
    DataStore.addChangeListener(this.onChange);
    this.onChange(); // check for data updates on initialisation
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

  setSortMethod: function(selectedColumn, columnIsReversed) {
    DataStore.setSortMethod(selectedColumn, columnIsReversed);
  },

  columnIsSelected: function(column) {
    return this.state.selectedColumn===column;
  },

  columnIsReversed: function(column) {
    return R.contains(column)(this.state.reversedColumns);
  },

  selectColumn: function(column) {
    this.setState({selectedColumn: column});
    return this.columnIsReversed(column);
  },

  reverseColumnDirection: function(column) {
    var columnIsReversed = this.columnIsReversed(column);
    if (columnIsReversed)
      var reversedColumns = R.difference(this.state.reversedColumns, [column]);
    else
      var reversedColumns = R.append(column, this.state.reversedColumns)
    this.setState({reversedColumns: reversedColumns});
    return !columnIsReversed;
  },

  handleClick: function(column) {
    if (!this.columnIsSelected(column))
      var columnIsReversed = this.selectColumn(column);
    else
      var columnIsReversed = this.reverseColumnDirection(column);
    this.setSortMethod(column, columnIsReversed);
  },

  getInitialState: function() {
    // TODO: should check there is at least one column
    var selectedColumn = this.props.schema[0].id;
    return { selectedColumn: selectedColumn, reversedColumns: [] };
  },

  componentDidMount: function() {
    var selectedColumn = this.state.selectedColumn;
    this.setSortMethod(selectedColumn, this.columnIsReversed(selectedColumn));
  },

  render: function() {
    var row = this.props.schema.map(function(column) {
      var boundClick = this.handleClick.bind(this, column.id);
      var tableClass = 'table-head' + 
        (this.columnIsSelected(column.id) ? ' selected-column' : '');
      var arrowClass = "fa " +
        (this.columnIsReversed(column.id) ? 'fa-arrow-down' : 'fa-arrow-up');
      return (
        <th onClick={boundClick}>
          <div className={tableClass}>
            {column.name}<i className={arrowClass}/>
          </div>
        </th>
      );
    }, this);
    return <tr>{row}</tr>;
  },
});

var DataRow = React.createClass({

  render: function() {
    var row = this.props.schema.map(function(column) {
      var val = this.props.data[column.id];
      var empty = val===undefined || val===null;
      return empty ? 
        <td className="empty">no data</td> :
        <td>{this.props.data[column.id]}</td>
    }, this);
    return <tr>{row}</tr>;
  }
});

module.exports = Table;

/** @jsx React.DOM */

var React = require('react');
var R = require('ramda');

var DataStore = require('../datastore');

var Table = React.createClass({

  getInitialState: function() {
    return {
      data: DataStore.getDataView(),
      schema: DataStore.getSchema()
    };
  },

  componentDidMount: function() {
    DataStore.addDataListener(this.onDataChange);
    DataStore.addSchemaListener(this.onSchemaChange);
  },

  componentWillUnmount: function() {
    DataStore.removeDataListener(this.onDataChange);
    DataStore.addSchemaListener(this.onSchemaChange);
  },

  onDataChange: function() {
    this.setState({data: DataStore.getDataView()});
  },

  onSchemaChange: function() {
    this.setState({schema: DataStore.getSchema()});
  },

  render: function() {
    return (
      <table>
        <thead><HeaderRow schema={this.state.schema}/></thead>
        <tbody>
          {this.state.data.map(function(row, i) {
            return <DataRow key={i} schema={this.state.schema} data={row}/>;
          }, this)}
        </tbody>
      </table>
    );
  }
});

var HeaderRow = React.createClass({

  propTypes: {
    schema: React.PropTypes.array.isRequired,
  },

  getInitialState: function() {
    var selectedColumn = DataStore.getSortColumn();
    return {
      selectedColumn: selectedColumn,
      reversedColumns: DataStore.getSortReversed() ? [selectedColumn] : []
    };
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
    DataStore.setSortMethod(column, columnIsReversed);
  },

  render: function() {
    var row = this.props.schema.map(function(column, i) {
      var boundClick = this.handleClick.bind(this, column.id);
      var tableClass = 'table-head' + 
        (this.columnIsSelected(column.id) ? ' selected-column' : '');
      var arrowClass = "fa " +
        (this.columnIsReversed(column.id) ? 'fa-arrow-down' : 'fa-arrow-up');
      return (
        <th key={i} onClick={boundClick}>
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

  propTypes: {
    schema: React.PropTypes.array.isRequired,
    data: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <tr>
        {this.props.schema.map(function(column, i) {
          var val = this.props.data[column.id];
          var empty = val===undefined || val===null;
          return empty ? 
            <td key={i} className="empty">no data</td> :
            <td key={i}>{this.props.data[column.id]}</td>
        }, this)}
      </tr>
    );
  }
});

module.exports = Table;

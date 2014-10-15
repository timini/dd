/** @jsx React.DOM */
// vim: sw=2:sts=2

var React = require('react');
var $ = require('jquery');
var cities = require('./cities');
var R = require('ramda');

var Table = React.createClass({
  render: function() {
    var rows = this.props.data.map(function(row) {
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
      return empty ? <EmptyCell/> : <Cell value={this.props.data[column.id]}/>
    }, this);
    return <tr>{row}</tr>;
  }
});

var Cell = React.createClass({
  render: function() {
    return <td>{this.props.value}</td>;
  }
});

var EmptyCell = React.createClass({
  render: function() {
    return <td className="empty">empty</td>;
  }
});

var NumericFilter = React.createClass({
  onChange: function() {
    this.props.filterCallback(this.getFilter());
  },
  getValue: function(ref) {
    return this.refs[ref].getDOMNode().value;
  },
  getFilter: function() {
    var num = this.getValue("number");
    if (!num && num!==0) return R.identity;
    var op = R[this.getValue("operation")];
    var col = this.getValue("column");
    var spec = {}
    spec[col] = function(val) { return op(val, num); };
    return R.filter(R.where(spec));
  },
  render: function() {
    var numeric = R.filter(R.where({'type': 'number'}), this.props.schema);
    return (
      <form onChange={this.onChange} className="filter-widget">
        <ColumnSelect columns={numeric} ref="column"/>
        <select ref="operation">
          <option value="gt">{'>'}</option>
          <option value="lt">{'<'}</option>
          <option value="eq">{'='}</option>
        </select>
        <input ref="number" type="number" placeholder="enter number..."/>
      </form>
    )
  }
});

var ColumnSelect = React.createClass({
  render: function() {
    return (
      <select> {this.props.columns.map(function(col, i) {
          return <option value={col.id}>{col.name}</option>
        }, this)}
      </select>
    )
  },
});

var App = React.createClass({
  getInitialState: function() {
    return {filter: R.identity} 
  },
  filterCallback: function(filter) {
    this.setState({filter: filter});
  },
  render: function() {
    var data = this.state.filter(this.props.data);
    return (
      <div>
        <NumericFilter
          filterCallback={this.filterCallback}
          schema={this.props.schema}
        />
        <Table schema={this.props.schema} data={data}/>
      </div>
    );
  }
});

$(function() {
  React.renderComponent(
    <App data={cities.data} schema={cities.schema}/>,
    document.getElementById("mountNode")
  );
});

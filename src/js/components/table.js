/** @jsx React.DOM */

var React = require('react');
var R = require('ramda');

var DataStore = require('../datastore');
var MetaStore = require('../metastore');
var ChangeEvent = require('../changeevent');

var Table = React.createClass({

  render: function() {
    return (
      <table>
        <TableHeader/>
        <TableData/>
      </table>
    );
  }
});

var TableHeader = React.createClass({

  getInitialState: function() {
    return {
      sortKey: null,
      schema: [],
      reversedColumns: []
    };
  },

  componentDidMount: function() {
    DataStore.on(ChangeEvent.SORT, this.onChange);
  },

  componentWillUnmount: function() {
    DataStore.removeListener(ChangeEvent.SORT, this.onChange);
  },

  onChange: function(data) {
    if (this.columnIsReversed(data.sortKey) !== data.sortReversed)
      var reversedColumns = this.reverseColumnDirection(data.sortKey);
    else
      var reversedColumns = this.state.reversedColumns;
    this.setState(R.mixin(data, {reversedColumns: reversedColumns}));
  },

  columnIsSelected: function(column) {
    return this.state.sortKey===column;
  },

  columnIsReversed: function(column) {
    return R.contains(column)(this.state.reversedColumns);
  },

  reverseColumnDirection: function(column) {
    if (this.columnIsReversed(column))
      var reversedColumns = R.difference(this.state.reversedColumns, [column]);
    else
      var reversedColumns = R.append(column, this.state.reversedColumns)
    return reversedColumns;
  },

  handleClick: function(column) {
    var columnIsReversed = this.columnIsReversed(column);
    if (this.columnIsSelected(column)) columnIsReversed = !columnIsReversed;
    DataStore.updateSortMethod(column, columnIsReversed);
  },

  render: function() {
    var row = this.state.schema.map(function(column, i) {
      var boundClick = this.handleClick.bind(this, column.key);
      var tableClass = 'table-head' + 
        (this.columnIsSelected(column.key) ? ' selected-column' : '');
      var arrowClass = "fa " +
        (this.columnIsReversed(column.key) ? 'fa-arrow-down' : 'fa-arrow-up');
      return (
        <th key={i} onClick={boundClick}>
          <div className={tableClass}>
            {column.name}<i className={arrowClass}/>
          </div>
        </th>
      );
    }, this);
    return <thead><tr>{row}</tr></thead>;
  }
});

var TableData = React.createClass({

  getInitialState: function() {
    return {items: [], schema: []};
  },

  componentDidMount: function() {
    DataStore.on(ChangeEvent.SORT, this.onChange);
  },

  componentWillUnmount: function() {
    DataStore.removeListener(ChangeEvent.SORT, this.onChange);
  },

  onChange: function(data) {
    this.setState(data);
  },

  render: function() {
    return (
      <tbody>
        {this.state.items.map(function(item, i) {
          return <Row key={i} schema={this.state.schema} item={item}/>;
        }, this)}
      </tbody>
    );
  }
});

var Row = React.createClass({

  getInitialState: function() {
    return {highlight: false}
  },

  propTypes: {
    schema: React.PropTypes.array.isRequired,
    item: React.PropTypes.object.isRequired
  },

  renderCell: function(field, i) {
    var val = this.props.item.data[field.key];
    return (val===undefined || val===null) ?
      <td key={i} className="empty">no data</td> :
      <td key={i}>{val}</td>;
  },

  componentDidMount: function() {
    MetaStore.addHighlightListener(this.onHighlight);
  },

  componentWillUnmount: function() {
    MetaStore.removeHighlightListener(this.onHighlight);
  },

  onHighlight: function(ids) {
    var highlight = ids && R.contains(this.props.item.id)(ids)
    if (highlight && !this.state.highlight)
      this.setState({highlight: true});
    else if (!highlight && this.state.highlight)
      this.setState({highlight: false});
  },

  onMouseEnter: function() {
    MetaStore.updateHighlightIds([this.props.item.id]);
  },

  onMouseLeave: function() {
    MetaStore.updateHighlightIds(null);
  },

  render: function() {
    var item = this.props.item;
    if (item.filtered) var className = "hide";
    else if (this.state.highlight) var className = "highlight";
    return (
      <tr className={className} onMouseEnter={this.onMouseEnter} 
          onMouseLeave={this.onMouseLeave}>
        {this.props.schema.map(function(field, i) {
          return this.renderCell(field, i);
        }, this)}
      </tr>
    );
  }
});

module.exports = Table;

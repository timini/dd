/** @jsx React.DOM */

var React = require('react');
var R = require('ramda');

var DataStore = require('../datastore');
var DataType = require('../datatype');

var FilterWidget = React.createClass({

  getInitialState: function() {
    return {schema: DataStore.getSchema()};
  },

  componentDidMount: function() {
    DataStore.addSchemaListener(this.onSchemaChange);
  },

  componentWillUnmount: function() {
    DataStore.removeSchemaListener(this.onSchemaChange);
  },

  onSchemaChange: function() {
    this.setState({schema: DataStore.getSchema()});
  },

  render: function() {
    var els = [];
    this.state.schema.forEach(function(column, i) {
      switch (column.type) {
        case DataType.CATEGORY:
          var el = <CategoryFilter column={column.id}/>; break;
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

var CategoryFilter = React.createClass({

  propTypes: {
    column: React.PropTypes.string.isRequired,
  },

  getInitialState: function() {
    var categories = R.map(
      R.get(this.props.column),
      DataStore.getOriginalData()
    );
    categories = R.uniq(R.filter(
      function(x) { return x!== null && x!==undefined },
      categories
    ));
    return {categories: categories, selected: [],};
  },

  componentDidMount: function() {
    DataStore.addDataListener(this.onDataChange);
  },

  componentWillUnmount: function() {
    DataStore.addDataListener(this.onDataChange);
  },

  onDataChange: function() {
    this.forceUpdate();
  },

  countCategories: function(categories) {
    categories = R.map(
      R.get(this.props.column),
      DataStore.getDataView([this.props.column])
    );
    return R.countBy(R.identity)(categories);
  },

  toggleSelected: function(category) {
    if (R.contains(category)(this.state.selected))
      var selected = R.difference(this.state.selected, [category])
    else
      var selected = R.append(category, this.state.selected)
    this.setState({selected: selected});
    return selected;
  },

  handleClick: function(category) {
    DataStore.setCategoryFilter(
      this.props.column,
      this.toggleSelected(category)
    );
  },

  categoryButton: function(category, count, i) {
    if (count)
      var boundClick = this.handleClick.bind(this, category, count);
    var className = "category-button";
    if (R.contains(category, this.state.selected)) className += " selected";
    if (!count) className += " not-available";
    return (
      <span key={i} onClick={boundClick} className={className}>
        {category} <span className="category-count">{count}</span>
      </span>
    );
  },

  render: function() {
    var count = this.countCategories();
    var categories = R.reverse(R.sortBy(
      function(x) { return count[x] || 0; },
      this.state.categories
    ));
    return (
      <div className="category-filter">
        {categories.map(function(category, i) {
          return this.categoryButton(category, count[category] || 0, i);
        }, this)}
      </div>
    );
  }
});

module.exports = FilterWidget;

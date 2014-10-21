/** @jsx React.DOM */

var React = require('react');
var R = require('ramda');

var DataStore = require('../datastore');
var DataType = require('../datatype');
var ChangeEvent = require('../changeevent');

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
    key: React.PropTypes.string.isRequired,
  },

  getInitialState: function() {
    return {items: []};
  },

  componentDidMount: function() {
    DataStore.on(ChangeEvent.FILTER, this.onChange);
  },

  componentWillUnmount: function() {
    DataStore.removeListener(ChangeEvent.FILTER, this.onChange);
  },

  onChange: function(data) {
    this.setState(data);
  },

  getCounts: function() {
    var counts = {};
    var key = this.props.key;
    this.state.items.forEach(function(item) {
      var category = item.data[key];
      if (category===null || category===undefined) return;
      if (!(category in counts)) counts[category] = 0;
      if (R.difference(item.filtered || [], [key]).length) return;
      counts[category] += 1;
    }, this);
    return counts;
  },

  selectedCategories: function() {
    var filterDef = this.state.filterDefs[this.props.key];
    return filterDef ? filterDef.categories || [] : [];
  },

  isSelected: function(category) {
    return R.contains(category)(this.selectedCategories())
  },

  toggleSelected: function(category) {
    if (this.isSelected(category))
      var selected = R.difference(this.selectedCategories(), [category])
    else
      var selected = R.append(category, this.selectedCategories())
    return selected;
  },

  handleClick: function(category) {
    DataStore.updateFilter(
      this.props.key,
      {categories: this.toggleSelected(category)}
    );
  },

  handleMouseEnter: function(category) {
    DataStore.updateHighlight(R.compose(
        R.eq(category),
        R.get(this.props.key)
    ));
  },

  handleMouseLeave: function() {
    DataStore.updateHighlight(null);
  },

  categoryButton: function(category, count, i) {
    var boundClick = this.handleClick.bind(this, category);
    var boundEnter = this.handleMouseEnter.bind(this, category);
    var className = "category-button";
    if (this.isSelected(category)) className += " selected";
    if (!count) className += " not-available";
    return (
      <span key={i} onClick={boundClick} onMouseEnter={boundEnter} 
          onMouseLeave={this.handleMouseLeave} className={className}>
        {category} <span className="category-count">{count}</span>
      </span>
    );
  },

  render: function() {
    var counts = this.getCounts();
    // TODO: secondary sort alphabetically
    var categories = R.sortBy(
      function(x) { return -counts[x]; },
      Object.keys(counts)
    );
    return (
      <div className="category-filter">
        {categories.map(function(category, i) {
          return this.categoryButton(category, counts[category], i);
        }, this)}
      </div>
    );
  }
});

module.exports = FilterWidget;

/** @jsx React.DOM */

var React = require('react');
var R = require('ramda');

var DataStore = require('../datastore');
var ChangeEvent = require('../changeevent');

var CategoryFilter = React.createClass({

  propTypes: {
    key: React.PropTypes.string.isRequired,
  },

  getInitialState: function() {
    return {items: [], hoveredItem: null};
  },

  componentDidMount: function() {
    DataStore.on(ChangeEvent.FILTER, this.onChange);
    DataStore.on('ITEM_HOVER', this.onItemHover);
  },

  componentWillUnmount: function() {
    DataStore.removeListener(ChangeEvent.FILTER, this.onChange);
    DataStore.removeListener('ITEM_HOVER', this.onItemHover);
  },

  onItemHover: function(item) {
    this.setState({hoveredItem: item});
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
    var isHoveredItem = this.state.hoveredItem &&
      this.state.hoveredItem.data[this.props.key]==category;
    var boundClick = this.handleClick.bind(this, category);
    var boundEnter = this.handleMouseEnter.bind(this, category);
    var className = "category-button";
    if (this.isSelected(category)) className += " selected";
    if (!count) className += " not-available";
    if (isHoveredItem) className += " highlight";
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

module.exports = CategoryFilter;

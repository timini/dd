/** @jsx React.DOM */

var React = require('react');
var R = require('ramda');

var DataStore = require('../datastore');
var ChangeEvent = require('../changeevent');

var CategoryFilter = React.createClass({

  propTypes: {
    fieldKey: React.PropTypes.string.isRequired,
  },

  getInitialState: function() {
    return {items: [], filterDefs: {}};
  },

  componentDidMount: function() {
    DataStore.on(ChangeEvent.FILTER, this.onChange);
  },

  componentWillUnmount: function() {
    DataStore.removeListener(ChangeEvent.FILTER, this.onChange);
  },

  onChange: function(state) {
    this.setState(state);
  },

  selectedCategories: function() {
    var filterDef = this.state.filterDefs[this.props.fieldKey];
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

  onClick: function(category) {
    DataStore.updateFilter(
      this.props.fieldKey,
      {categories: this.toggleSelected(category)}
    );
  },

  getGroups: function() {
    return R.groupBy(
      R.compose(R.get(this.props.fieldKey), R.get('data')),
      this.state.items
    );
  },

  getSortOrder: function(groups, counts) {
    return R.sort(function(category) {
      return groups[category].count; 
    }, Object.keys(groups));
  },

  getCounts: function(groups) {
    var counts = R.mapObj(R.alwaysZero, groups);
    var keyArray = [this.props.fieldKey];
    for (var category in groups) {
      var items = groups[category];
      groups[category].forEach(function(item) {
        if (!item.filtered || !R.difference(item.filtered, keyArray).length)
          counts[category] += 1;
      }, this);
    }
    return counts;
  },

  render: function() {
    var groups = this.getGroups();
    var counts = this.getCounts(groups);
    var order = R.sortBy(
      function(category) { return -counts[category]; },
      Object.keys(groups)
    );
    return (
      <div className="category-filter">
        {order.map(function(category, i) {
          var boundClick = this.onClick.bind(this, category);
          return (
            <CategoryButton
              key={i}
              category={category}
              fieldKey={this.props.fieldKey}
              items={groups[category]}
              selected={this.isSelected(category)}
              onClick={boundClick}
              count={counts[category]}
            />
          );
        }, this)}
      </div>
    );
  }
});

var CategoryButton = React.createClass({

  propTypes: {
    fieldKey: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func,
    selected: React.PropTypes.bool,
    items: React.PropTypes.array.isRequired,
    count: React.PropTypes.number.isRequired
  },

  getInitialState: function() {
    return {highlight: false};
  },

  onMouseEnter: function() {
    DataStore.updateHighlight(R.compose(
        R.eq(this.props.category),
        R.get(this.props.fieldKey)
    ));
  },

  onItemHover: function(item) {
    this.setState({hoveredItem: item});
  },

  componentDidMount: function() {
    DataStore.on('ITEM_HOVER', this.onItemHover);
  },

  componentWillUnmount: function() {
    DataStore.removeListener('ITEM_HOVER', this.onItemHover);
  },

  onMouseLeave: function() {
    DataStore.updateHighlight(null);
  },

  render: function() {
    isHoveredItem = false;
    var count = this.props.count;
    var className = "category-button";
    if (this.props.selected) className += " selected";
    if (!count) className += " not-available";
    if (isHoveredItem) className += " highlight";
    return (
      <span onClick={this.props.onClick} onMouseEnter={this.onMouseEnter} 
          onMouseLeave={this.onMouseLeave} className={className}>
        {this.props.category}
        <span className="category-count">{count}</span>
      </span>
    );
  },
});


module.exports = CategoryFilter;
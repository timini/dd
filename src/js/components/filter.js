/** @jsx React.DOM */

var React = require('react');
var R = require('ramda');

var DataStore = require('../datastore');
var DataTypes = require('../datatypes');

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
        case DataTypes.CATEGORY:
          var el = <CategoryFilter column={column.id}/>; break;
        default: return;
      }
      els.push(<dt key={i*2}>{column.name}</dt>)
      els.push(<dd key={i*2+1}>{el}</dd>);
    });
    return <dl>{els}</dl>;
  },
});

var CategoryFilter = React.createClass({

  propTypes: {
    column: React.PropTypes.string.isRequired,
  },

  getInitialState: function() {
    var data = R.map(R.get(this.props.column), DataStore.getOriginalData());
    var state = {};
    R.uniq(data).forEach(function(category) {
      if (category) state[category] = false;
    });
    return state;
  },

  getSelected: function() {
    categories = [];
    for (var category in this.state) {
      if (this.state[category]) categories.push(category);
    }
    return categories;
  },

  handleClick: function(category) {
    var categoryState = !this.state[category];
    var selected = this.getSelected();
    var state = {};
    state[category] = categoryState;
    this.setState(state);
    DataStore.setCategoryFilter(this.props.column, categoryState ?
      R.append(category, selected) :
      R.difference(selected, [category])
    );
  },

  categoryButton: function(category, i) {
    var boundClick = this.handleClick.bind(this, category);
    var className = "category-button" +
      (this.state[category] ? " selected" : "");
    return (
      <span key={i} onClick={boundClick} className={className}>
        {category}
      </span>
    );
  },

  render: function() {
    return (
      <div className="category-filter">
        {Object.keys(this.state).map(function(category, i) {
          return this.categoryButton(category, i);
        }, this)}
      </div>
    );
  }
});

module.exports = FilterWidget;

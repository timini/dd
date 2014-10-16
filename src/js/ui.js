/** @jsx React.DOM */

var React = require('react');
var R = require('ramda');

var DataStore = require('./datastore');

var FilterWidget = React.createClass({
  render: function() {
    var filters = [];
    this.props.schema.forEach(function(column) {
      switch (column.type) {
        case "category":
          filters.push(
            <div>
              <h5>{column.name}</h5>
              <CategoryFilter column={column.id}/>
            </div>
          );
      }
    });
    return <dl>{filters}</dl>;
  },
});

var CategoryFilter = React.createClass({
  componentWillMount: function() {
    var data = DataStore.getAllData();
    var categories = R.uniq(R.map(R.prop(this.props.column), data));
    this.setState({categories: categories});
  },
  onChange: function(e) {
    categories = [];
    for (var ref in this.refs) {
      if (this.refs[ref].isChecked()) categories.push(ref);
    }
    DataStore.setCategoryFilter(this.props.column, categories);
  },
  render: function() {
    var categories = this.state.categories.map(function(category) {
      var ref = category.toLowerCase();
      return <CategoryCheckbox ref={ref} category={category}/>
    });
    return (
      <form className="category-filter" onChange={this.onChange}>
        {categories}
      </form>
    );
  }
});

var CategoryCheckbox = React.createClass({
  isChecked: function() {
    return this.refs.checkbox.getDOMNode().checked;
  },
  render: function() {
    var lowerCategory = this.props.category.toLowerCase();
    return (
      <div className="category-checkbox">
        <label>
          <input type="checkbox" ref="checkbox" value={lowerCategory}/>
          <span>{this.props.category}</span>
        </label>
      </div>
    );
  }
});

exports.CategoryFilter = CategoryFilter;
exports.FilterWidget = FilterWidget;

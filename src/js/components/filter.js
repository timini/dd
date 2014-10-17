/** @jsx React.DOM */

var React = require('react');
var R = require('ramda');

var DataStore = require('../datastore');

var FilterWidget = React.createClass({

  getInitialState: function() {
    return {schema: DataStore.getSchema()};
  },

  componentDidMount: function() {
    DataStore.addSchemaListener(this.onSchemaChange);
  },

  componentWillUnmount: function() {
    DataStore.removeDataListener(this.onDataChange);
  },

  onSchemaChange: function() {
    this.setState({schema: DataStore.getSchema()});
  },

  render: function() {
    var els = [];
    this.state.schema.forEach(function(column, i) {
      switch (column.type) {
        case "category":
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

  componentWillMount: function() {
    var data = DataStore.getOriginalData();
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
    return (
      <form className="category-filter" onChange={this.onChange}>
        {this.state.categories.map(function(category, i) {
          return (
            <CategoryCheckbox
              ref={category.toLowerCase()} key={i} category={category}
            />
          );
        })}
      </form>
    );
  }
});

var CategoryCheckbox = React.createClass({

  propTypes: {
    category: React.PropTypes.string.isRequired,
  },

  isChecked: function() {
    return this.refs.checkbox.getDOMNode().checked;
  },

  render: function() {
    return (
      <div className="category-checkbox">
        <label>
          <input type="checkbox" ref="checkbox"/>
          <span>{this.props.category}</span>
        </label>
      </div>
    );
  }
});

module.exports = FilterWidget;

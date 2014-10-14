/** @jsx React.DOM */

var React = require('react');
var $ = require('jquery');
var cities = require('./cities');

var App = React.createClass({
    getInitialState: function() {
        return {filterText: ''};
    },
    filterCallback: function(filterText) {
        this.setState({filterText: filterText});
    },
    render: function() {
        return (
            <div>
                <SearchBar
                    filterText={this.state.filterText}
                    filterCallback={this.filterCallback}
                />
                <Table 
                    schema={this.props.schema}
                    data={this.props.data}
                    filterText={this.state.filterText}
                />
            </div>
        );
    }
});

var Table = React.createClass({
    render: function() {
        var rows = this.props.data.map(function(row) {
            return (
                <DataRow
                    schema={this.props.schema}
                    data={row}
                    filterText={this.props.filterText}
                />
            );
        }, this);
        return (
            <table>
                <thead><HeaderRow schema={this.props.schema}/></thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
});

var DataRow = React.createClass({
    render: function() {
        var row = this.props.schema.map(function(column) {
            var val = this.props.data[column.id];
            var empty = val===undefined || val===null;
            return empty ?
                <EmptyCell/> : 
                <Cell
                    value={this.props.data[column.id]}
                    filterText={this.props.filterText}
                />
        }, this);
        return <tr>{row}</tr>;
    }
});

var Cell = React.createClass({
    render: function() {
        var val = this.props.value.toString()
        var filterText = this.props.filterText.toLowerCase();
        if (filterText && val.toLowerCase().indexOf(filterText) >= 0) {
            return <td className="selected">{val}</td>
        }
        return <td>{val}</td>
    }
});

var EmptyCell = React.createClass({
    render: function() {
        return <td className="empty">empty</td>
    }
});

var HeaderRow = React.createClass({
    render: function() {
        var row = this.props.schema.map(function(column) {
            return <th>{column.name}</th>
        });
        return <tr>{row}</tr>
    }
});

var SearchBar = React.createClass({
    onChange: function() {
        this.props.filterCallback(this.refs.filterInput.getDOMNode().value);
    },
    render: function() {
        return (
            <input
                type="text"
                placeholder="filter.."
                ref="filterInput"
                value={this.props.filterText}
                onChange={this.onChange}
            />
        )
    }
});

$(function() {
    React.renderComponent(
        <App data={cities.data} schema={cities.schema}/>,
        document.getElementById("mountNode")
    );
});

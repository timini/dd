/** @jsx React.DOM */

var React = require('react');
var $ = require('jquery');
var cities = require('./cities');

var Table = React.createClass({
    render: function() {
        var rows = this.props.data.map(function(row) {
            return <DataRow schema={this.props.schema} data={row}/>
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
                <Cell value={this.props.data[column.id]}/>
        }, this);
        return <tr>{row}</tr>;
    }
});

var Cell = React.createClass({
    render: function() {
        return <td>{this.props.value}</td>
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

$(function() {
    React.renderComponent(
        <Table data={cities.data} schema={cities.schema}/>,
        document.getElementById("mountNode")
    );
});

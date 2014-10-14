/** @jsx React.DOM */

var React = require('react');
var $ = require('jquery');
var cities = require('./cities');

var Table = React.createClass({
    render: function() {
        var colNames = Object.keys(this.props.data[0]);
        var rows = this.props.data.map(function(row) {
            return <DataRow colNames={colNames} data={row}/>
        });
        return (
            <table>
                <thead><HeaderRow colNames={colNames}/></thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
});

var DataRow = React.createClass({
    render: function() {
        var row = this.props.colNames.map(function(name) {
            return <td>{this.props.data[name]}</td>;
        }, this);
        return <tr>{row}</tr>;
    }
});

var HeaderRow = React.createClass({
    render: function() {
        var row = this.props.colNames.map(function(name) {
            return <th>{name}</th>
        });
        return <tr>{row}</tr>
    }
});

$(function() {
    React.renderComponent(
        <Table data={cities.data}/>,
        document.getElementById("mountNode")
    );
});

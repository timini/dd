/** @jsx React.DOM */

var React = require('react');
var $ = require('jquery');
var cities = require('./cities');

var App = React.createClass({
  render: function(){
    return <h3>{this.props.text}</h3>;
 }
});

var Table = React.createClass({
  render: function(){
      return (
          <table>
              <thead>
                  <tr>{header}</tr>
              </thead>
              <tbody>
                  {rows}
              </tbody>
          </table>
      );
  }
});

var colNames = Object.keys(cities.data[0]);

var header = colNames.map(function(col) {
    return <th>{col}</th>;
});

var rows = cities.data.map(function(x) {
    return <tr>{row(x)}</tr>
});

function row(x) {
    return colNames.map(function(name) {
        return <td>{x[name]}</td>;
    });
}


$(function() {
    React.renderComponent(
        <Table />,
        document.getElementById("mountNode")
    );
});

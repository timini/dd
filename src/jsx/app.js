/** @jsx React.DOM */

var React = require('react');
var $ = require('jquery');

var App = React.createClass({
  render: function(){
    return <h3>{this.props.text}</h3>;
  }
});

$(function() {
    React.renderComponent(
        <App text="tingmo" />,
        document.getElementById("mountNode")
    );
});

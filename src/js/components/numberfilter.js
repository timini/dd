/** @jsx React.DOM */

var React = require('react');
var R = require('ramda');

var DataStore = require('../datastore');
var ChangeEvent = require('../changeevent');

var NumberFilter = React.createClass({

  propTypes: {
    fieldKey: React.PropTypes.string.isRequired,
  },

  getInitialState: function() {
    return {items: [], hoveredItem: null};
  },

  componentDidMount: function() {
    DataStore.on(ChangeEvent.FILTER, this.onChange);
  },

  componentWillUnmount: function() {
    DataStore.removeListener(ChangeEvent.FILTER, this.onChange);
  },

  onChange: function(data) {
    this.setState(data);
  },

  render: function() {
    return <Histogram items={this.state.items} fieldKey={this.props.fieldKey} 
      width={300} height={70} padding={3}/>;
  }
});

var Histogram = React.createClass({

  propTypes: {
    items: React.PropTypes.array.isRequired,
    fieldKey: React.PropTypes.string.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    padding: React.PropTypes.number,
    numBins: React.PropTypes.number
  },

  getBins: function() {
    if (!this.props.items.length) return [];
    var getValue = R.compose(R.get(this.props.fieldKey), R.get('data'));
    var items = this.props.items;
    var binEdges = this.getBinEdges(
      R.map(getValue, items),
      this.props.numBins||8
    );
    var bins = R.times(function(i) {
      var min = binEdges[i];
      var max = binEdges[i+1];
      var predicate = R.and(R.gt(max), R.lte(min));
      return {
        min: min,
        max: max,
        items: R.filter(R.compose(predicate, getValue), items)
      }
    }, binEdges.length-1);
    return bins;
  },

  getBinEdges: function(values, desiredBins) {
    var roundTo = function(x, n, fn) {
      fn = fn || Math.round;
      return fn(x / n) * n;
    }
    var log10 = function(x) { return Math.log(x) / Math.LN10; }
    var min = R.min(values);
    var max = R.max(values);
    var width = (max-min) / desiredBins;
    var order = Math.pow(10, ~~log10(width));
    width = roundTo(width, order);
    min = roundTo(min, width, Math.floor);
    max = roundTo(max, width, Math.ceil);
    return R.times(
      function(i) { return i*width + min; },
      Math.round((max - min)/width) + 1
    );
  },

  render: function() {
    var bins = this.getBins();
    var padding = this.props.padding;
    var barWidth = ~~(this.props.width / bins.length) - padding;
    var barHeight = this.props.height - padding;
    var largestBinSize = R.max(R.map(
      function(bin) { return bin.items.length; }, 
      bins
    ));
    return (
      <svg className="histogram" width={this.props.width}
          height={this.props.height}>
        {bins.map(function(bin, i) {
          var x = padding/2 + i*(barWidth+padding);
          var y = padding/2;
          return (
            <Bar key={i} width={barWidth} height={barHeight} x={x} y={y}
              bin={bin} largestBinSize={largestBinSize} fieldKey={this.props.fieldKey}/>
          );
        }, this)}
      </svg>
    );
  }
});

var Bar = React.createClass({
  
  propTypes: {
    bin: React.PropTypes.object.isRequired,
    largestBinSize: React.PropTypes.number.isRequired,
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    fieldKey: React.PropTypes.string.isRequired,
  },

  getInitialState: function() {
    return {highlight: false};
  },

  componentDidMount: function() {
    DataStore.on('ITEM_HOVER', this.onItemHover);
  },

  componentWillUnmount: function() {
    console.log('unmount');
    DataStore.removeListener('ITEM_HOVER', this.onItemHover);
  },

  onMouseEnter: function() {
    var bin = this.props.bin;
    var key = this.props.fieldKey;
    DataStore.updateHighlight(
      R.compose(
        R.and(R.gt(bin.max), R.lte(bin.min)),
        R.get(key)
      )
    );
    this.setState({highlight: true})
  },

  onMouseLeave: function() {
    DataStore.updateHighlight(null);
    this.setState({highlight: false})
  },

  onItemHover: function(item) {
    // TODO: does not work with item copies
    this.setState({
      highlight: R.contains(item)(this.props.bin.items)
    });
  },

  render: function() {
    var bin = this.props.bin;
    var largestBinSize = this.props.largestBinSize;
    var height = this.props.height * (bin.items.length / largestBinSize);
    var y = this.props.y + (this.props.height - height);
    var cls = this.state.highlight ? " highlight" : "";
    return (
      <g>
        <rect className="empty" x={this.props.x} y={this.props.y} width={this.props.width} 
          height={this.props.height-height} onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave} />
        <rect className={"bar" + cls} x={this.props.x} y={y} width={this.props.width} 
          height={height} onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}/>
      </g>
    );
  }
});

module.exports = NumberFilter;

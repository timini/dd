var EventEmitter = require('events').EventEmitter;
var R = require('ramda');
var merge = require('react/lib/merge');

var DataType = require('./datatype');
var ChangeEvent = require('./changeevent');
var filtering = require('./filtering');

var ITEM_HOVER = 'ITEM_HOVER';

var items = [];
var schema = [];
var filters = {};
var sortKey = null;
var sortReversed = false;
var filterDefs = {};
var highlightFn = null;
var hoveredItem = null;

var cache = {};


/**
 * Sort the data set. Empty values are always placed at the end.
 */
function sortItems(items) {
  var column = R.find(R.where({key: sortKey}), schema);
  if (!column) return items;
  var getColumn = R.compose(R.get(column.key), R.get("data"));
  var sort = R.sortBy(R.compose(
    column.datatype===DataType.NUMBER ? parseFloat : R.toLowerCase,
    getColumn
  ));
  if (sortReversed) sort = R.compose(R.reverse, sort);
  var isEmpty = function(x) { return x===null || x===undefined };
  items = R.partition(R.compose(isEmpty, getColumn), items);
  var empty = items[0], items = items[1];
  return R.concat(sort(items), empty);
}

function getHighlight(items) {
  return items.map(function(item) {
    return {
      data: item.data,
      filtered: item.filtered,
      highlight: highlightFn ? highlightFn(item.data) : false,
    }
  });
}

var DataStore = merge(EventEmitter.prototype, {

  /**
   * The DataStore object can emit multiple events, which are organised in
   * a hierarchy: emitting one event will also propagate events lower in the
   * hierarchy. When listening to events, the highest level possible should
   * be listened to so that components are not re-rendered unnecessarily.
   */
  eventHierarchy: [
    ChangeEvent.SCHEMA,
    ChangeEvent.DATA,
    ChangeEvent.FILTER,
    ChangeEvent.SORT,
    ChangeEvent.HIGHLIGHT
  ],

  /**
   * Initialised new a data-set.
   */
  load: function(newSchema, newItems, newSortKey, newSortReversed) {
    schema = newSchema;
    items = newItems;
    sortKey = newSortKey || schema[0].key;
    sortReversed = newSortReversed || false;
    this.applyPipeline(ChangeEvent.SCHEMA);
  },

  /**
   * Specify how the items should be sorted.
   *
   * @param {string} key The column used for sorting
   * @param {boolean} descending Sort ascending/descending
   */
  updateSortMethod: function(key, reversed) {
    sortKey = key;
    sortReversed = reversed;
    this.applyPipeline(ChangeEvent.SORT);
  },

  updateFilter: function(key, filterDef) {
    filterDefs[key] = filterDef;
    this.applyPipeline(ChangeEvent.FILTER);
  },

  updateHighlight: function(fn) {
    highlightFn = fn;
    this.applyPipeline(ChangeEvent.HIGHLIGHT);
  },

  // TODO: This event type is maybe beyond the scope of the DataStore object,
  // should probably be handled by another store.
  updateItemHover: function(item) {
    hoveredItem = item;
    this.emit(ITEM_HOVER, item);
  },


  /**
   * Apply the pipeline and notify all listeners. Optionally specify a
   * ChangeEvent type, so that cached data before a specific point in the event
   * hierarchy is not recomputed.
   */
  applyPipeline: function(evt) {
    // TODO: This function re-states the ordering eventHierarchy, and will be 
    // incorrect if the order changes.
    var SCHEMA = ChangeEvent.SCHEMA,
        DATA = ChangeEvent.DATA,
        FILTER = ChangeEvent.FILTER,
        SORT = ChangeEvent.SORT,
        HIGHLIGHT = ChangeEvent.HIGHLIGHT;
    evt = evt || SCHEMA;
    switch (evt) {
      case SCHEMA:
        null; // Do nothing and continue
      case DATA:
        null; // Do nothing and continue
      case FILTER:
        var filters = filtering.createFilters(schema, filterDefs);
        cache[FILTER] = filtering.filterItems(items, filters);
      case SORT:
        cache[SORT] = sortItems(cache[FILTER]);
      case HIGHLIGHT:
        cache[HIGHLIGHT] = getHighlight(cache[SORT]);
    }
    this.emitChange(evt);
  },

  /**
   * Retrieve the data (should not be called directly, will be received by
   * registered listeners upon event propagation)
   */
  _getData: function() {
    var pipelineEnd = this.eventHierarchy[this.eventHierarchy.length-1];
    return {
      schema: schema,
      items: cache[pipelineEnd],
      sortKey: sortKey,
      sortReversed: sortReversed,
      filterDefs: filterDefs,
    };
  },

  /**
   * Emit change event to all listeners. This should not be called directly.
   */
  emitChange: function(evt) {
    var data = this._getData();
    var idx = R.findIndex(R.eq(evt), this.eventHierarchy);
    this.eventHierarchy.slice(idx).forEach(function(evt) {
      this.emit(evt, data);
    }, this);
  },
});

module.exports = DataStore;

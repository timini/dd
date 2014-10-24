var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var R = require('ramda');

var ChangeEvent = require('../consts/changeevent');
var filtering = require('../core/filtering');
var sorting = require('../core/sorting');

//-----------------------------------------------------------------------------

var items = [];
var schema = {};
var displayed = [] // Array of displayed field keys in order to display
var filters = {};
var sortKey = null; // Key of field to sort items by
var sortReversed = false;
var filterDefs = {};
var cache = {};

var DataStore = merge(EventEmitter.prototype, {

  /**
   * The DataStore object can emit multiple events, which are organised in
   * a hierarchy: emitting one event will also propagate events lower in the
   * hierarchy. When listening to events, the highest level possible should
   * be listened to so that components are not re-rendered unnecessarily.
   */
  eventHierarchy: [
    ChangeEvent.SCHEMA,
    ChangeEvent.FIELDS,
    ChangeEvent.DATA,
    ChangeEvent.FILTER,
    ChangeEvent.SORT,
  ],

  /**
   * Initialised new a data-set.
   */
  load: function(newSchema, newItems, newDisplayed, newSortKey, 
      newSortReversed) {
    schema = newSchema;
    displayed = newDisplayed;
    items = newItems.map(function(data, i) {
      return { id: i, data: data };
    });
    sortKey = newSortKey || fields[0] || null;
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
    evt = evt || SCHEMA;
    switch (evt) {
      case SCHEMA:
        null; // Do nothing and continue
      case DATA:
        null; // Do nothing and continue
      case FILTER:
        var filters = filtering.createFilters(filterDefs, schema);
        cache[FILTER] = filtering.filterItems(items, filters);
      case SORT:
        cache[SORT] = sorting.sortItems(cache[FILTER], schema, sortKey, 
            sortReversed);
    }
    this.emitChange(evt);
  },

  /**
   * Retrieve the data (should not be called directly, will be received by
   * registered listeners upon event propagation)
   */
  getData: function() {
    var pipelineEnd = this.eventHierarchy[this.eventHierarchy.length-1];
    return {
      schema: schema,
      displayed: displayed,
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
    var data = this.getData();
    var idx = R.findIndex(R.eq(evt), this.eventHierarchy);
    this.eventHierarchy.slice(idx).forEach(function(evt) {
      this.emit(evt, data);
    }, this);
  },
});

DataStore.setMaxListeners(100);

module.exports = DataStore;

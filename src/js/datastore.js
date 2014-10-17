var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var R = require('ramda');

var DATA_CHANGE_EVENT = 'data-change';
var SCHEMA_CHANGE_EVENT = 'schema-change';

var _data = null;
var _schema = null;
var _filters = {};
var _sortColumn = null;
var _sortReversed = false;

/**
 * Sort the data set. Empty rows are always at the bottom.
 */
function sortData(data) {
  var column = R.find(R.where({id: _sortColumn}), _schema);
  if (!column) return data;
  var getColumn = R.get(column.id);
  var sort = R.sortBy(R.compose(
    column.type==='number' ? parseFloat : R.toLowerCase,
    getColumn
  ));
  if (_sortReversed) sort = R.compose(R.reverse, sort);
  var isEmpty = function(x) { return x===null || x===undefined };
  var data = R.partition(R.compose(isEmpty, getColumn), data);
  var emptyData = data[0], data = data[1];
  return R.concat(sort(data), emptyData);
}

function filterData(data) {
  if (Object.keys(_filters).length === 0) return data;
  return R.filter(R.where(_filters), data);
}

var DataStore = merge(EventEmitter.prototype, {

  /*
   * Triggers event upon change in the data view
   */
  _emitDataChange: function() { this.emit(DATA_CHANGE_EVENT); },

  /*
   * Triggers event upon change in the schema
   */
  _emitSchemaChange: function() { this.emit(SCHEMA_CHANGE_EVENT); },

  /**
   * Retrieve the view into the data on the basis of the sorting method and
   * filters set.
   */
  getDataView: function() { return R.pipe(sortData, filterData)(_data); },

  getOriginalData: function() { return _data; },

  getSchema: function() { return _schema; },

  getSortColumn: function () { return _sortColumn; },

  getSortReversed: function () { return _sortReversed; },


  /**
   * @param {function} callback
   */
  addDataListener: function(callback) {
    this.on(DATA_CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeDataListener: function(callback) {
    this.removeListener(DATA_CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  addSchemaListener: function(callback) {
    this.on(SCHEMA_CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeSchemaListener: function(callback) {
    this.removeListener(SCHEMA_CHANGE_EVENT, callback);
  },

  /**
   * Specify how the data should be sorted.
   *
   * @param {string} column The column used for sorting
   * @param {boolean} descending Sort ascending/descending
   */
  setSortMethod: function(sortColumn, sortReversed) {
    _sortColumn = sortColumn;
    _sortReversed = sortReversed;
    this._emitDataChange();
  },

  /**
   * Set the filter used for a particular column.
   *
   * @param {string} column
   * @param {function|*} filter Either a predicate function, or some other 
   *    value, in which case an equality check is performed.
   */
  setFilter: function(column, filter) {
    _filters[column] = filter;
    this._emitDataChange();
  },

  /**
   * Set a filter on the basis of numerical range.
   *
   * @param {string} column
   * @param {number} min The minimum permitted value
   * @param {number} max The maximum permitted value
   */
  setRangeFilter: function(column, min, max) {
    var filter = R.and(R.gte(max), R.lte(min));
    this.setFilter(column, filter);
  },

  /**
   * Set a filter for categorical columns.
   *
   * @param {string} column
   * @param {array} Array of strings with categories to retain. If empty,
   *  display all.
   */
  setCategoryFilter: function(column, categories) {
    if (!categories.length)
      var filter = R.alwaysTrue;
    else
      var filter = function(value) {
        return R.some(R.eq(value), categories);
      };
    this.setFilter(column, filter);
  },

  /**
   * Remove the filter assigned to the specific column.
   *
   * @param {string} column
   */
  removeFilter: function(column) {
    delete _filters[column];
  },

  /**
   * Remove filters from all columns.
   */
  removeAllFilters: function() {
    _filters = {};
  }
});

function loadTestData() {
  var cities = require('./testdata/cities');
  _data = cities.data;
  _schema = cities.schema;
  _sortColumn = 'population';
  _sortReversed = true;
}

loadTestData();

module.exports = DataStore;

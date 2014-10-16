var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var R = require('ramda');
var cities = require('./cities');

var CHANGE_EVENT = 'change';

var _data = cities.data;
var _schema = cities.schema;

var _filters = {};
var _sortColumn = null;
var _sortDescending = false;

function sortData(data) {
  if (!_sortColumn) return data;
  var sort = R.sortBy(R.compose(R.toLowerCase, R.prop(_sortColumn)));
  if (_sortDescending) sort = R.compose(R.reverse, sort);
  return sort(data);
}

function filterData(data) {
  if (Object.keys(_filters).length === 0) return data;
  return R.filter(R.where(_filters), data);
}

var DataStore = merge(EventEmitter.prototype, {

  _emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * Retrieve the view into the data on the basis of the sorting method and
   * filters set.
   */
  getDataView: function() {
    return {data: R.pipe(sortData, filterData)(_data)}
  },

  getAllData: function() {
    return _data
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  /**
   * Specify how the data should be sorted.
   *
   * @param {string} column The column used for sorting
   * @param {boolean} descending Sort ascending/descending
   */
  setSortMethod: function(column, descending) {
    _sortColumn = column;
    _sortDescending = descending;
    this._emitChange();
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
    this._emitChange();
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

  setCategoryFilter: function(column, categories) {
    if (!categories.length)
      var filter = R.alwaysTrue;
    else
      var filter = function(value) {
        return R.some(R.eq(value.toLowerCase()), categories);
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

module.exports = DataStore;

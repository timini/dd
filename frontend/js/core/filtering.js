var R = require('ramda');

var DataType = require('../consts/datatype');

//-----------------------------------------------------------------------------

/**
 * Create filtering functions for particular fields in a schema
 *
 * @param {object} schema
 * @param {object} filterDefs Object where keys are field keys, and values are 
 *  arguments used to initialise the filter function. The type of filter
 *  function returned is dependent on the datatype for the field.
 */
function createFilters(filterDefs, schema) {
  return R.mapObj.idx(
    function(filterDef, key) {
      return createFilter(schema[key].datatype, filterDef);
    },
    filterDefs
  );
}

/**
 * Apply filters to some items
 *
 * @param {array} items Items to be filtered
 * @param {object} filters Object where keys are item fields, and values are
 *  predicates to be applied to those fields.
 */
function filterItems(items, filters) {
  return items.map(function(item) {
    return {
      id: item.id,
      data: item.data,
      filtered: filterItem(item, filters)
    };
  });
}

/**
 * Test each column filter on the given row, returning a list of columns 
 * representinig which filters were truthy, or null if the row should not be 
 * filtered. 
 *
 * @param {object} item
 * @param {object} filters
 */
function filterItem(item, filters) {
  var filtered = [];
  var result, filter;
  for (var key in filters) {
    var value = item.data[key];
    filter = filters[key];
    if (filter===null || filter===undefined) continue;
    if(typeof filter==='function' ? !filter(value) : value!==filter)
      filtered.push(key)
  }
  return filtered.length ? filtered : null;
}

/**
 * Initialise filtering function.
 *
 * @param {string} datatype
 * @param {object} filterDef Arguments for initialisation
 */
function createFilter(datatype, filterDef) {
  if (filterDef===null || filterDef===undefined) return null;
  switch (datatype) {
    case DataType.CATEGORY:
      return createCategoryFilter(filterDef.categories);
    case DataType.NUMBER:
      return createRangeFilter(filterDef.min, filterDef.max);
    default:
      return null;
  }
}

/**
 * Create a filter from a finite set of categories.
 *
 * @param {array} categories Permitted categories. If empty, allow any.
 */
function createCategoryFilter(categories) {
  categories = categories || [];
  if (categories.length)
    return function(value) {
      return R.some(R.eq(value), categories);
    };
  else return null;
}

/**
 * Create a filter for a numeric range
 *
 * @param {number} min The minimum permitted value
 * @param {number} max The maximum permitted value
 */
function createRangeFilter(min, max) {
    return R.and(R.gte(max), R.lte(min))
}

module.exports = {
  createFilters: createFilters,
  filterItems: filterItems
};

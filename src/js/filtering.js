var R = require('ramda');

var DataType = require('./datatype');

/**
 * Create filtering functions for particular fields in a schema
 *
 * @param {object} schema
 * @param {object} filterDefs Object where keys are field keys, and values are 
 *  arguments used to initialise the filter function. The type of filter
 *  function returned is dependent on the datatype for the field.
 */
function createFilters(schema, filterDefs) {
  filters = {};
  for (var key in filterDefs) {
    var field = R.find(R.where({key: key}), schema);
    filters[key] = createFilter(field.datatype, filterDefs[key]);
  }
  return filters;
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
    filter = filters[key];
    if (filter===null || filter===undefined) continue;
    if(typeof filter==='function' ? !filter(item[key]) : item[key]!==filter)
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

function createCategoryFilter(categories) {
  categories = categories || [];
  if (categories.length)
    return function(value) {
      return R.some(R.eq(value), categories);
    };
  else return null;
}

function createRangeFilter(min, max) {
    return R.and(R.gte(max), R.lte(min))
}

module.exports = {
  createFilters: createFilters,
  filterItems: filterItems
};

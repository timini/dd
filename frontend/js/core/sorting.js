var R = require('ramda');

var DataType = require('../consts/datatype');

//-----------------------------------------------------------------------------

/**
 * Sort the data set. Empty values are always placed at the end.
 *
 * @param {array} items Items to be sorted
 */
function sortItems(items, schema, sortKey, sortReversed) {
  var getField = R.compose(R.get(sortKey), R.get('data'));
  var sort = R.sortBy(R.compose(
    schema[sortKey].datatype===DataType.NUMBER ? parseFloat : R.toLowerCase,
    getField
  ));
  if (sortReversed) sort = R.compose(R.reverse, sort);
  var isEmpty = function(x) { return x===null || x===undefined };
  items = R.partition(R.compose(isEmpty, getField), items);
  var empty = items[0], items = items[1];
  return R.concat(sort(items), empty);
}

module.exports.sortItems = sortItems;

var keyMirror = require('react/lib/keyMirror');

var ChangeEvent = keyMirror({
  SCHEMA: null,
  DATA: null,
  FILTER: null,
  SORT: null,
  HIGHLIGHT: null
});

module.exports = ChangeEvent;

var keyMirror = require('react/lib/keyMirror');

var DataType = keyMirror({
  NUMBER: null,
  STRING: null,
  CATEGORY: null,
  BOOLEAN: null,
  DATE: null,
  URL: null,
  VECTOR2: null,
  VECTOR3: null
});

module.exports = DataType;

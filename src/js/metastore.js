var EventEmitter = require('events').EventEmitter;
var R = require('ramda');
var merge = require('react/lib/merge');
var keyMirror = require('react/lib/keyMirror');

var MetaEvents = keyMirror({
  HIGHLIGHT: null
});

var MetaStore = merge(EventEmitter.prototype, {

  addHighlightListener: function(callback) {
    this.on(MetaEvents.HIGHLIGHT, callback);
  },

  removeHighlightListener: function(callback) {
    this.removeListener(MetaEvents.HIGHLIGHT, callback);
  },

  updateHighlightIds: function(ids) {
    this.emit(MetaEvents.HIGHLIGHT, ids);
  },
});

MetaStore.setMaxListeners(100);

module.exports = MetaStore;

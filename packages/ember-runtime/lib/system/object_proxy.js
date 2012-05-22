require('ember-runtime/system/object');
var get = Ember.get, set = Ember.set, bind = Ember.bind;

Ember.ObjectProxy = Ember.Object.extend({
  content: null,
  _proxyBindings: {},
  willWatchProperty: function (key) {
    if (key in this) return;
    // bind unknownProperty
    this._proxyBindings[key] = bind(this, key, 'content.' + key);
  },
  didUnwatchProperty: function (key) {
    var binding = this._proxyBindings[key];
    if (binding) {
      // revert back to unknownProperty behavior
      binding.disconnect();
      delete this._proxyBindings[key];
      delete this[key];
    }
  },
  unknownProperty: function (key) {
    var content = get(this, 'content');
    if (content) {
      return get(content, key);
    }
  },
  setUnknownProperty: function (key, value) {
    var content = get(this, 'content');
    if (content) {
      return set(content, key, value);
    }
  }
});

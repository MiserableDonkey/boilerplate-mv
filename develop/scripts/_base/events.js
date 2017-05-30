Application.Base['Events'] = function() {
  var Events = {};
  Object.defineProperties(Events, {
    _listeners: {
      writable: true,
      enumerable: false,
      value: {}
    },
    on: {
      enumerable: true,
      writable: false,
      value: function (event, callback) {
        if (this._listeners[event] == undefined) this._listeners[event] = [];
        this._listeners[event].unshift(callback);
        return callback;
      }
    },
    off: {
      enumerable: true,
      writable: false,
      value: function (event, callback) {
        try {
          if (callback != undefined) {
            var callbacks = this._listeners[event];
            var callbackIndex = callbacks.indexOf(callback);
            this._listeners[event].splice(callbackIndex, 1);
          } else {
            this._listeners[event] = undefined;
          }
        } catch (e) {}
      }
      },
    trigger: {
      enumerable: true,
      writable: false,
      value: function (event, data) {
        var callbacks = this._listeners[event] || [];
        var i = callbacks.length;
        while (i--) {
          callbacks[i](data);
        }
      }
    },
  });
  return Events;
};

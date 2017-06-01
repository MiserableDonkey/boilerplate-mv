Application.Base['Model'] = function(options) {
  var Model = _.extend(new Application.Base['Events'](), new Application.Base['AJAX']());
  Object.defineProperties(Model, {
    _options: {
      writable: true,
      enumberable: false,
    },
    options: {
      enumerable: true,
      get: function() {
        return this._options;
      },
      set: function(value) {
        value = value || {};
        if(typeof value === 'object' && !Array.isArray(value)) {
          this._options = value;
          this['id'] = this.options['id'] || _.uniqueId();
          this['url'] = this.options['url'] || '';
          this['data'] = this.options['data'] || {};
          if(this.options['collection']) this['collection'] = this.options['collection'];
        }
      },
    },
    _data: {
      writable: true,
      enumerable: false,
      value: {},
    },
    data: {
      enumerable: true,
      get: function() {
        return this._data;
      },
      set: function(value) {
        if(value && !Array.isArray(value) && typeof value === 'object') {
          this.setProperties(value);
        }
      }
    },
    destroy: {
      enumerable: true,
      value: function() {
        if(this.collection) {
          this.collection.removeModelByID(this.getProperty('id'));
        }
        this.data = {};
        this.trigger('remove');
        return this;
      },
    },
    getProperty: {
      enumerable: true,
      value: function(value) {
        return this.data[value];
      },
    },
    setProperty: {
      enumerable: true,
      value: function(key, value) {
        var _key = String('_').concat(key);
        Object.defineProperties(this.data, {
          [_key]: {
            writable: true,
            enumerable: false,
          },
          [key]: {
            configurable: true,
            enumerable: true,
            get: function() {
              return this[_key];
            },
            set: function(_value) {
              this[_key] = value;
              Model.trigger('change', Model);
              Model.trigger(String('change').concat(':', _key), Model);
            },
          }
        });
        this.data[key] = value;
        return this.data[key];
      },
    },
    setProperties: {
      enumerable: true,
      writable: false,
      value: function(properties) {
        if(properties && !Array.isArray(properties) && typeof properties === 'object') {
          if(!Object.keys(properties).length) {
            _.each(this.data, function(_value, _key) {
              this.removeProperty(_key);
            }.bind(this));
          }else {
            if(!properties['id']) properties['id'] = this.id;
            _.each(properties, function(_value, _key) {
              this.setProperty(_key, _value);
            }.bind(this));
          }
          this.trigger('ready', Model);
        }
      },
    },
    removeProperty: {
      enumerable: true,
      writable: false,
      value: function(value) {
        try {
          if(value && this.data[value]) {
            delete this.data[value];
            Model.trigger('change', Model);
          }
        } catch(err) {}
      },
    },
    parse: {
      enumerable: true,
      value: function(data) {
        var _parseData = data || this._data;
        return JSON.parse(JSON.stringify(_parseData));
      }
    },
  });
  Model.options = options || {};
  return Model;
};

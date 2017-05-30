var Application = (function(window){
  window.Application = {
    Base: {},
  };
  return window.Application;
})(window);

Application.Base['AJAX'] = function() {
  var AJAX = {};
  Object.defineProperties(AJAX, {
    get: {
      enumerable: true,
      writable: false,
      value: function(options) {
        var _options = options || {};
        if(!_options.url) _options.url = this.url;
        var $ajax = $.ajax(_options);
        $ajax.then(function(response) {
          if(response) this.data = response;
        }.bind(this));
        return $ajax;
      },
    },
    post: {
      enumerable: true,
      writable: false,
      value: function(options) {
        var _options = options || {};
        if(!_options.url) _options.url = this.url;
        var $ajax = $.ajax(_options);
        $ajax.then(function(response) {
          if(response) this.data = response;
        }.bind(this));
        return $ajax;
      },
    },
    put: {
      enumerable: true,
      writable: false,
      value: function(options) {
        var _options = options || {};
        if(!_options.url) _options.url = this.url;
        var $ajax = $.ajax(_options);
        $ajax.then(function(response) {
          if(response) this.data = response;
        }.bind(this));
        return $ajax;
      },
    },
    del: {
      enumerable: true,
      writable: false,
      value: function(options) {
        var _options = options || {};
        if(!_options.url) _options.url = this.url;
        var $ajax = $.ajax(_options);
        $ajax.then(function(response) {
          if(response) this.data = response;
        }.bind(this));
        return $ajax;
      },
    }
  });
  return AJAX;
};

Application.Base['Collection'] = function(options) {
  var Collection = _.extend(new Application.Base['Events'](), new Application.Base['AJAX']());
  Object.defineProperties(Collection, {
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
          this['id'] = this._options['id'] || Application.Utilities.guid();
          this['url'] = this._options['url'];
          this['model'] = this._options['model'] || Application.Base['Model'];
          this['data'] = this._options['data'] || {};
        }
      },
    },
    _data: {
      writable: true,
      enumberable: false,
      value: [],
    },
    data: {
      enumerable: true,
      get: function() {
        return this._data;
      },
      set: function(value) {
        if(value && Array.isArray(value)) {
          this.setModels(value, true);
        }
      }
    },
    _models: {
      writable: true,
      enumberable: false,
      value: [],
    },
    models: {
      enumerable: true,
      get: function() {
        return this._models;
      },
    },
    getModelByID: {
      value: function(_id) {
        var _model = _.filter(this.models, function(_model, _modelIndex) {
          if(_model.data.id === _id) {
            _index = _modelIndex;
            return this.models[_modelIndex];
          }
        }.bind(this))[0];
        return _model;
      },
    },
    removeModelByID: {
      enumerable: true,
      writable: false,
      value: function(id) {
        var _id = id;
        var _model = this.getModelByID(_id);
        if(_model) {
          var _index = _.indexOf(this.models, {
            id: _id
          });
          this.models.splice(_index, 1);
          this.data.splice(_index, 1);
        }
      },
    },
    setModel: {
      enumerable: true,
      writable :false,
      value: function(data, force) {
        var _id = data.id;
        var _model = this.getModelByID(_id);
        if(!_model || force) {
          _model = new this.model({
            data: data
          });
          _model.on('ready', function() {
            this.trigger('change', this);
          }.bind(this));
          _model.on('change', function(model) {
            this.trigger('change', this);
          }.bind(this));
          _model.on('remove', function(model) {
            this.trigger('change', this);
          }.bind(this));
          this.models.push(_model);
          this._data.push(_model.parse());
        }else {
          var _index = _.indexOf(this.models, {
            id: _id
          });
          this.models[_index] = _model.parse();
        }
      },
    },
    setModels: {
      enumerable: true,
      writable: false,
      value: function(data, force) {
        if(Array.isArray(data)) {
          _.each(data, function(_dataItem, _dataItemIndex) {
            this.setModel(_dataItem, force);
          }.bind(this));
        }
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
  Collection.options = options || {};
  return Collection;
};

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
          this['id'] = this.options['id'] || Application.Utilities.guid();
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
        this.collection.removeModelByID(this.getProperty('id'));
        this.data = {};
        this.trigger('remove', Model);
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

Application.Base['Router'] = function(options) {
  var Router = new Application.Base['Events']();
  Object.defineProperties(Router, {
    token: {
      writable: true,
      enumerable: false,
      value: {
        hash: '#',
        path: '/',
        query: '?',
        separator: '&',
        assignment: '=',
      },
    },
    _options: {
      writable: true,
      enumerable: false,
      value: {},
    },
    options: {
      enumerable: true,
      get: function() {
        return this._options;
      },
      set: function(value) {
        value = value || value;
        if(typeof value === 'object' && !Array.isArray(value)) {
          this._options = value;
          this.element = this._options.element || window;
          this.paths = this._options.paths || {};
          this.controllers = this._options.controllers || {};
        }
      },
    },
    _$element: {
      writable: true,
      enumberable: false,
    },
    $element: {
      enumerable: true,
      get: function() {
        return this._$element;
      },
      set: function(value) {
        if(typeof value === 'object') {
          if(!this.element) {
            this._element = this.$element[0];
          }
          this._$element = value;
        }
      },
    },
    _element: {
      writable: true,
      enumerable: false,
    },
    element: {
      enumerable: true,
      get: function() {
        return this._element;
      },
      set: function(value) {
        if(typeof value === 'object' && !Array.isArray(value)) {
          this._element = value;
          this.$element = $(value);
          this.$element.on('hashchange', $.proxy(this.hashChange, this));
        }
      },
    },
    hashChange: {
      writable: false,
      enumerable: true,
      value: function(event) {
        var hashData = this.element.location.hash.split(this.token.query);
        this.path = hashData[0].split(this.token.hash).pop();
        if(hashData[1]) this.parameters = hashData[1];
        this.navigate(this.path, this.parameters);
        return this;
      },
    },
    _path: {
      writable: true,
      enumerable: false,
      value: {},
    },
    path: {
      enumerable: true,
      get: function() {
        return this._path;
      },
      set: function(value) {
        if(typeof value === 'string') {
          var _path = {};
          var _splitPath = value.split(this.token.path);
          _splitPath = _.without(_splitPath, '');
          _.each(_splitPath, function(_fragment, _fragmentIndex) {
            _path[_fragmentIndex] = _fragment;
          }.bind(this));
          if(!Object.keys(_path).length && (value === this.token.path)) {
            _path[0] = this.token.path;
          }
          this._path = _path;
        }
      },
    },
    _parameters: {
      writable: true,
      enumerable: false,
      value: {},
    },
    parameters: {
      enumerable: true,
      get: function() {
        return this._parameters;
      },
      set: function(value) {
        if(typeof value === 'string') {
          var _parameters = {};
          _parameters = _.object(value.split(this.token.separator).map(function(_parameter){
            return _parameter.split(this.token.assignment);
          }.bind(this)));
          _parameters = _.omit(_parameters, _.isEmpty);
          this._parameters = _parameters;
        }
      },
    },
    _paths: {
      writable: true,
      enumerable: false,
      value: {},
    },
    paths: {
      enumerable: true,
      get: function() {
        return this._paths;
      },
      set: function(value) {
        if(typeof value === 'object' && !Array.isArray(value)) {
          this._paths = value;
        }
      },
    },
    _controllers: {
      writable: true,
      enumerable: false,
      value: {},
    },
    controllers: {
      enumerable: true,
      get: function() {
        return this._controllers;
      },
      set: function(value) {
        if(typeof value === 'object' && !Array.isArray(value)) {
          this._controllers = value;
        }
      },
    },
    navigate: {
      enumerable: true,
      value: function(path, parameters) {
        var _routeData = {};
        var _routeName = '';
        if(
          (typeof path === 'object') &&
          !Array.isArray(path) &&
          Object.keys(path).length
        ) {
          _routeData['path'] = path;
        }
        if(
          (typeof parameters === 'object') &&
          !Array.isArray(parameters) &&
          Object.keys(parameters).length
        ) {
          _routeData['parameters'] = parameters;
        }
        _.each(_routeData.path, function(_fragmentName) {
          if(_fragmentName !== this.token.path) {
            _routeName = _routeName.concat(this.token.path, _fragmentName);
          }else {
            _routeName = this.token.path;
          }
        }.bind(this));
        _routeData['name'] = _routeName;
        this.controllers[this.paths[_routeName]](_routeData);
        this.trigger('navigate', _routeData);
        return this;
      },
    },
  });
  Router.options = options || {};

  return Router;
};

Application.Base['View'] = function(options) {
  var View = new Application.Base['Events']();
  Object.defineProperties(View, {
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
          this['id'] = this.options['id'] || Application.Utilities.guid();
          this['elementName'] = this.options['elementName'] || 'div';
          this['template'] = this.options['template'] || _.template('');
          this['ui'] = this.options['ui'] || null;
          this['uiEvents'] = this.options['uiEvents'] || null;
          this['model'] = this.options['model'] || null;
          this['collection'] = this.options['collection'] || null;
        }
      },
    },
    _ui: {
      writable: true,
      enumberable: false,
      value: {},
    },
    ui: {
      enumerable: true,
      get: function() {
        return this._ui;
      },
      set: function(value) {
        if(typeof value === 'object') {
          _.each(value, function(_key, _selector) {
            this._ui[_key] = this.$element.find(_selector);
          }.bind(this));
        }
      },
    },
    _uiEvents: {
      writable: true,
      enumberable: false,
      value: {},
    },
    uiEvents: {
      enumerable: true,
      get: function() {
        return this._uiEvents;
      },
      set: function(value) {
        if(typeof value === 'object') {
          this._uiEvents = value;
          _.each(this._uiEvents, function(_key, _event) {
            _key = _key.replace(', ', '');
            var _propertySeparator = ' ';
            var _valueSeparator = ',';
            var _uiHash = '@';
            var _selectorsData = _key.split(' ')[1];
            var _eventsData = _key.split(' ')[0];
            _selectorsData = _selectorsData.split(_valueSeparator);
            _eventsData = _eventsData.split(_valueSeparator);
            _.each(_selectorsData, function(_selectorString) {
              var _uiElement = {};
              if(_selectorString.match(_uiHash)) {
                var _uiHashString = _selectorString.replace(_uiHash, '');
                _uiElement = this[_uiHashString];
              }else {
                _uiElement = this.$element.find(_selectorString);
              }
              _.each(_eventsData, function(_eventName) {
                _uiElement.on(_eventName, $.proxy(this[_event], this));
              }.bind(this));
            }.bind(this));
          }.bind(this));
        }
      },
    },
    _model: {
      writable: true,
      enumberable: false,
    },
    model: {
      enumerable: true,
      get: function() {
        return this._model;
      },
      set: function(value) {
        if(
          (value !== null) &&
          (typeof value === 'object')
        ) {
          this._model = value;
          this._model.on('ready', $.proxy(this.render, this));
          this._model.on('change', $.proxy(this.render, this));
        }else if(value === null) {
          this._model = new Application.Base['Model']();
        }
      },
    },
    _collection: {
      writable: true,
      enumberable: false,
    },
    collection: {
      enumerable: true,
      get: function() {
        return this._collection;
      },
      set: function(value) {
        if(
          (value !== null) &&
          (typeof value === 'object')
        ) {
          this._collection = value;
          this._collection.on('ready', $.proxy(this.render, this));
          this._collection.on('change', $.proxy(this.render, this));
        }
      },
    },
    _elementName: {
      writable: true,
      enumberable: false,
    },
    elementName: {
      enumerable: true,
      get: function() {
        return this._elementName;
      },
      set: function(value) {
        if(typeof value === 'string') {
          this._elementName = value;
          this.element = document.createElement(this._elementName);
        }
      },
    },
    _element: {
      writable: true,
      enumberable: false,
    },
    element: {
      enumerable: true,
      get: function() {
        return this._element;
      },
      set: function(value) {
        if(typeof value === 'object') {
          var _elementName = this.elementName || this._options.elementName || 'div';
          var _elementAttributes = this.elementAttributes || this._options.elementAttributes || {};
          this._element = document.createElement(_elementName);
          _.each(_elementAttributes, function(_elementValue, _elementAttribute) {
            this._element.setAttribute(_elementAttribute, _elementValue);
          }.bind(this));
          this._$element = $(this._element);
        }
      },
    },
    _$element: {
      writable: true,
      enumberable: false,
    },
    $element: {
      enumerable: true,
      get: function() {
        return this._$element;
      },
      set: function(value) {
        if(typeof value === 'object') {
          if(!this.element) {
            this._element = this.$element[0];
          }
          this._$element = value;
        }
      },
    },
    _template: {
      writable: true,
      enumberable: false,
    },
    template: {
      enumerable: true,
      get: function() {
        return this._template;
      },
      set: function(value) {
        this._template = value;
      },
    },
    render: {
      enumerable: true,
      value: function() {
        var _templateContext = this.collection ||
                               this.options.collection ||
                               this.model ||
                               this.options.model;
        this.$element.html(this.template(_templateContext));
        return this;
      },
    }
  });
  View.options = options;
  return View;
};

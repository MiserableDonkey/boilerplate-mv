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

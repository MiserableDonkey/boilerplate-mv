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
    _ignoreHashChange: {
      writable: true,
      enumerable: false,
      value: false,
    },
    ignoreHashChange: {
      enumerable: true,
      get: function() {
        return this._ignoreHashChange;
      },
      set: function(value) {
        if(value !== this._ignoreHashChange) this._ignoreHashChange = value;
      }
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
          this['element'] = this.options['element'] || window;
          this['routes'] = this.options['routes'] || {};
          this['controllers'] = this.options['controllers'] || {};
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
    _routeData: {
      writable: true,
      enumerable: false,
      value: {},
    },
    routeData: {
      enumerable: true,
      get: function() {
        return this._routeData;
      },
      set: function(value) {
        if(typeof value === 'string') {
          var _hashData = this.element.location.hash.split(this.token.query);
          this._routeData = {};
          if(_hashData[0]) {
            this.path = _hashData[0].split(this.token.hash).pop();
            this._routeData['path'] = this.path;
          }
          if(_hashData[1]) {
            this.parameters = _hashData[1];
            this._routeData['parameters'] = this.parameters;
          }
        }
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
          var _splitRoute = value.split(this.token.path);
          _splitRoute = _.without(_splitRoute, '');
          this._path = {
            endpoint: '',
            fragments: {},
          };
          _.each(_splitRoute, function(_fragment, _fragmentIndex) {
            this._path['endpoint'] = String(this._path['endpoint']).concat(this.token.path, _fragment);
            this._path['fragments'][_fragmentIndex] = _fragment;
            if(_fragmentIndex === (Object.keys(_splitRoute).length - 1)) {
              this._path['endpoint'] = this._path['endpoint'].concat(this.token.path);
            }
          }.bind(this));
        }
      },
    },
    _parameters: {
      writable: true,
      enumerable: false,
      value: {
        query: '',
        properties: {},
      },
    },
    parameters: {
      enumerable: true,
      get: function() {
        return this._parameters;
      },
      set: function(value) {
        if(typeof value === 'string') {
          this._parameters = {
            query: '',
            properties: {},
          };
          this._parameters['properties'] = _.object(value.split(this.token.separator).map(function(_parameter) {
            this._parameters['query'] = String(this.token.query).concat(value);
            return _parameter.split(this.token.assignment);
          }.bind(this)));
          this._parameters['properties'] = _.omit(this._parameters['properties'], _.isEmpty);
        }
      },
    },
    _routes: {
      writable: true,
      enumerable: false,
      value: {},
    },
    routes: {
      enumerable: true,
      get: function() {
        return this._routes;
      },
      set: function(value) {
        if(typeof value === 'object' && !Array.isArray(value)) {
          this._routes = value;
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
    silentHashChange: {
      enumerable: true,
      value: function(path) {
        if(typeof path === 'string') {
          this.ignoreHashChange = true;
          this.element.location.hash = path;
          this.$element.one('hashchange', function() {
            this.ignoreHashChange = false;
          }.bind(this));
        }
      }
    },
    hashChange: {
      writable: false,
      enumerable: true,
      value: function(event) {
        if(!this.ignoreHashChange) {
          this.routeData = this.element.location.hash;
          this.navigate(this.routeData);
        }else {
          event.preventDefault();
        }
        return this;
      },
    },
    navigate: {
      enumerable: true,
      value: function(_routeData) {
        var _routeController = this.routeController(_routeData);
        if(typeof _routeController === 'function') {
          _routeController(_routeData);
          this.silentHashChange(_routeData.path.endpoint);
          this.trigger('navigate', _routeData);
        }
        return this;
      },
    },
    routeController: {
      enumerable: true,
      value: function(routeData) {
        var _routeController = {};
        var _routeMap = {};
        if(typeof routeData.path.endpoint === 'string' && routeData.path.endpoint.length) {
          _routeController = this.controllers[this.routes[routeData.path.endpoint]];
        }
        return _routeController;
      }
    },
  });
  Router.options = options || {};

  return Router;
};

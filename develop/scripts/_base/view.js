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
          this['id'] = this.options['id'] || _.uniqueId();
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
        var _templateContext = {};
        if(this.model) _templateContext['model'] = this.model.parse();
        if(this.collection) _templateContext['collection'] = this.collection.parse();
        this.$element.html(this.template(_templateContext));
        return this;
      },
    }
  });
  View.options = options;
  return View;
};

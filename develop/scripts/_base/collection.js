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
          this['id'] = this._options['id'] || _.uniqueId();
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
          this.trigger('ready', this);
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
          var _index = _.findIndex(this.parse(), {
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

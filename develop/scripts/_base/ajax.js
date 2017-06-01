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
          console.log(response);
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

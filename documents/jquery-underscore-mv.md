# Use plain JS with some library support

Backbone and Angular, even when scaled to minimum use, may be unnecessary or prohibited.
If a framework can not be used or is not necessary, and the level of project complexity
is relatively simple, consider using plain JavaScript with library support for key
components. For example, jQuery AJAX is a sophisticated library for managing HTTP
requests and Underscore has markup template processing capability; leveraging these
utilities (which account for 100s of lines of necessary logic) allows a simple MV
convention to form.

*Consider an example where url hash changes trigger new views to be rendered:*

**Requirements:**

 * [jQuery(CDN)](https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js)
 * [Underscore(CDN)](https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js)


## Example

```
var appRouter = new router({
  controllers: {
    posts: function(event) {
      var appModel = new model({
        method: 'GET',
        url: 'http://jsonplaceholder.typicode.com/posts',
      });
      var appView = new view({
        template: _appTemplate,
        model: appModel
      });
      appView.model.get().then(function(response) {
        $('body').append(appView.render().$element);
      }.bind(this));
    },
  },
  routes: {
    '/posts': 'posts'
  },
});

```

### Model

```
var model = function(settings) {
  var _model = {
    data: null,
    settings: settings,
    get: function() {
      var $ajax = $.ajax(this.settings);
      $ajax.then(function(response) {
        this.data = JSON.parse(JSON.stringify(response));
        return this.data;
      }.bind(this));
      return $ajax;
    },
  };
  return _model;
};
```

### View

```
var view = function(settings) {
  var _view = {
    $element: null,
    template: settings.template,
    model: settings.model,
    render: function() {
      var _template = this.template({
        data: this.model.data
      });
      this.$element = $.parseHTML(_template)[0];
      return this;
    },
  };
  return _view;
};
```


### Template

```
var _appTemplate = function(data) {
  var _template = _.template(
    String().concat(
      '<div id="app">',
        '<header>',
          '<h4>Posts</h4>',
        '</header>',
        '<main>',
          '<div class="content">',
            '<ul>',
              '<% _.each(data, function(_data) { %>',
                '<li><%= _data.id %></li>',
              '<% }) %>',
            '</ul>',
          '</div>',
        '</main>',
      '</div>'
    )
  )(data);
  return _template;
};
```


### Router

```
var router = function(settings) {
  var _router = {
    routes: {}
  };
  _.each(settings.routes, function(_routeValue, _routeKey) {
    _router.routes[_routeKey] = settings.controllers[_routeValue];
  }.bind(this));
  $(window).on('hashchange', function(event) {
    var _route = String(window.location.hash).split('#').pop();
    try{
      _router.routes[_route](event);
    }catch(err) {
      console.log('Undefined route.')
    }
  }.bind(this));
  return _router;
};
```

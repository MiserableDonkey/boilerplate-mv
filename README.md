# Boilerplate - MV

Minimalistic client-side Model/View boilerplate using Handlebars templates,
jQuery AJAX and selector engine, and Underscore utilities. For situations where
an MV pattern is useful/necessary but an existing framework or technique can not
be used.

## Choosing an MV framework

Anything from standalone web page components to fully-packaged client-side applications
can use an MV pattern or framework. Separating code between model data and view
markup is good practice in general and should not necessarily be considered additional
effort.

**Before choosing to use this consider these options:**

* Use an existing MV framework
* Use plain JS with some library support
* Use Boilerplate MV

## Use an existing MV framework instead of this one

Both Backbone and Angular can be scaled for very simple and highly complex projects.
With simple implementations Backbone and Angular can be relied on for low learning
curb and comprehensive documentation. The model/view programming pattern conventions
used in both frameworks is easily recognizable.

* [Backbone](https://www.backbonejs.org)/[Marionette](https://www.marionettejs.com)
* [Angular](https://angular.io/)


## Use plain JS with some library support instead of this one

Backbone and Angular, even when scaled to minimum use, may be unnecessary or prohibited.
If a framework can not be used or is not necessary, and the level of project complexity
is relatively simple, consider using plain JavaScript with library support for key
components. For example, jQuery AJAX is a sophisticated library for managing HTTP
requests and Underscore has markup template processing capability. Consider a variation
of the following pattern:  

**Requirements:**
 * [jQuery(CDN)](https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js)
 * [Underscore(CDN)](https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js)


### Template

```
var appTemplate = function(data) {
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


### Router

```
var router = function(settings) {
  var _router = {
    routes: {}
  };
  _.each(settings.routes, function(_routeValue, _routeKey) {
    _router.routes[_routeKey] = _routeValue;
  }.bind(this));
  $(window).on('hashchange', function(event) {
    var _route = String(window.location.hash).split('#').pop();
    try{
      _router.routes[_route]();
    }catch(err) {}
  }.bind(this));
  return _router;
};
```


### Example

```
var appModel = new model({
  method: 'GET',
  url: 'http://jsonplaceholder.typicode.com/posts',
});
var appView = new view({
  template: appTemplate,
  model: appModel
});
appView.model.get().then(function(response) {
  $('body').append(appView.render().$element);
}.bind(this));
```


## Use Boilerplate MV

Router
Collection
Model
View

...

```

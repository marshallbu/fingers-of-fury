/*global require: false */

/* [@marshallbu: Jul 27, 2013]: RequireJS config
 * This wonderful config object passed to require.config() sets up paths,
 * common dependency names to be used throughout your app, as well as 
 * dependency hierarchy.  This is so you can have things that need jQuery
 * for instance load after jQuery is fully downloaded/loaded.
 */ 
require.config({
  // baseUrl: "js/",
  paths: {
    // app: "../app",
    jquery: [
      '../vendor/jquery/jquery.min'
    ],
    'jquery.detectmobile': [
      'libs/jquery.detectmobilebrowser.min'
    ],
    angular: [
      '../vendor/angular/angular'
    ],
    angularResource: '../vendor/angular-resource/angular-resource.min',
    lodash: [
      '../vendor/lodash/dist/lodash.underscore.min'
    ],
    'underscore.string': '../vendor/underscore.string/dist/underscore.string.min',
    mediaelement: '../vendor/mediaelement/build/mediaelement.min',
    bootstrap: '../vendor/bootstrap.css/js/bootstrap.min',
    io: '/socket.io/socket.io'
  },
  shim: {
    'jquery.detectmobile': {
      deps: ['jquery']
    },
    angular: {
      exports: 'angular'
    },
    angularResource: {
      deps: ['angular']
    },
    lodash: {
      exports: '_'
    },
    'underscore.string': {
      deps: ['lodash']
    },
    bootstrap: {
      deps: ['jquery']
    }
  }
});


/* this is setting up require and just some general dependencies, like jquery,
 * bootstrap's js, angular, etc.
 * The names array in the first parameter, are referencing dependencies defined
 * in the config above, and then loaded as name variables passed to the function
 * in the second parameter.
 * TODO [@marshallbu: Jul 27, 2013]: clean up the above explanation with proper 
 * requirejs documentation as well as using @mikedorseyjr's fancy commenting
 * scheme
 */
require([
  'jquery',
  'jquery.detectmobile',
  'bootstrap',
  'angular',
  'angularResource',
  'app',
  'routes'
], function ($, detectmobile, bootstrap, angular, angularResource, app, routes) {
  'use strict';
  $(document).ready(function () {
    var $html = $('html');
    angular.bootstrap($html, [app.name]);
    // Because of RequireJS we need to bootstrap the app 'app' manually
    // and Angular Scenario runner won't be able to communicate with our app
    // unless we explicitely mark the container as app holder
    // More info: https://groups.google.com/forum/#!msg/angular/yslVnZh9Yjk/MLi3VGXZLeMJ
    $html.attr('ng-app','myApp');

    //TODO: any additional things that need to be done here?
    // if it's DOM manipulation, just do it in a directive

  });
});

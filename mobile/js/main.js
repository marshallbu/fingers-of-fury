'use strict';

// THIS IS THE MOBILE VIEW MAIN.JS, PAY ATTENTION!!

require.config({
  paths: {
    angular: '/js/lib/angular/angular.min',
    angularResource: '/js/lib/angular/angular-resource',
    underscore: '/js/lib/underscore-min',
    'underscore.string': '/js/lib/underscore.string.min',
    bootstrap: '/js/lib/bootstrap.min',
    io: '/socket.io/socket.io'
  },
  shim: {
    angular: {
      exports: 'angular'
    },
    angularResource: {
      deps: ['angular']
    },
    underscore: {
      exports: '_'
    },
    'underscore.string': ['underscore'],
    bootstrap: {
      debs: [
        'jquery'
      ]
    }
  }
});

require([
  'jquery',
  'underscore',
  'underscore.string',
  'bootstrap',
  'io',
  'angular',
  'angularResource',
  'app',
  'services/services',
  'directives/directives',
  'controllers/game',
  'routes'
], function ($, _, _s, bootstrap, io, angular, angularResource, app, services, directives, game) {
    angular.element(document).ready(function() {
      angular.bootstrap(document, ['fof']);
    });
});

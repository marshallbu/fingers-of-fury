'use strict';

// THIS IS THE MOBILE VIEW MAIN.JS, PAY ATTENTION!!

require.config({
  paths: {
    angular: '/js/lib/angular/angular.min',
    underscore: '/js/lib/underscore-min',
    'underscore.string': '/js/lib/underscore.string.min',
    bootstrap: '/js/lib/bootstrap.min',
    io: '/socket.io/socket.io'
  },
  shim: {
    angular: {
      exports: 'angular'
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
  'app',
  'controllers/game',
  'routes'
], function ($, _, _s, bootstrap, io, angular, app, game) {
    angular.element(document).ready(function() {
      angular.bootstrap(document, ['fof']);
    });
});

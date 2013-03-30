'use strict';

require.config({
  paths: {
    angular: 'lib/angular/angular.min',
    underscore: 'lib/underscore-min',
    'underscore.string': 'lib/underscore.string.min',
    bootstrap: 'lib/bootstrap.min',
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

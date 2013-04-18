'use strict';

require.config({
  paths: {
    angular: 'lib/angular/angular',
    angularResource: 'lib/angular/angular-resource',
    underscore: 'lib/underscore-min',
    'underscore.string': 'lib/underscore.string.min',
    bootstrap: 'lib/bootstrap.min',
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
  'controllers/game',
  'routes'
], function ($, _, _s, bootstrap, io, angular, angularResource, app, services, game) {
    angular.element(document).ready(function() {
      angular.bootstrap(document, ['fof']);
    });
});

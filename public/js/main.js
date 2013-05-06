'use strict';

require.config({
  paths: {
    angular: 'lib/angular/angular',
    angularResource: 'lib/angular/angular-resource',
    underscore: 'lib/underscore-min',
    'underscore.string': 'lib/underscore.string.min',
    mediaelement: 'lib/mediaelement/mediaelement',
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
    mediaelement: {
      deps: ['angular', 'jquery']
    },
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
  'mediaelement',
  'bootstrap',
  'io',
  'angular',
  'angularResource',
  'app',
  'services/services',
  'services/soundengine',
  'directives/directives',
  'controllers/game',
  'routes'
], function ($, _, _s, mediaelement, bootstrap, io, angular, angularResource, app, services, soundengine, directives, game) {
    angular.element(document).ready(function() {
      angular.bootstrap(document, ['fof']);
    });
});

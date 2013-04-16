'use strict';

define([
  'app',
  'controllers/game'
], function(app, game) {
  return app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'partials/game-control-default.html'
    });
    
    $routeProvider.when('/:sessionId', {
      templateUrl: 'partials/game-control-intro.html'
    });
      
    $routeProvider.otherwise({redirectTo: '/'});

  }]);

});
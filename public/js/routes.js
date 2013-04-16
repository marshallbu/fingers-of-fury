'use strict';

define([
  'app',
  'controllers/game'
], function(app, game) {
  return app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'partials/game-intro.html'
    });
      
    $routeProvider.when('/board', {
      templateUrl: 'partials/game-board.html'
    });

    $routeProvider.otherwise({redirectTo: '/'});

  }]);

});
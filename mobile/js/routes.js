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

    // $routeProvider.when('/control/:sessionId', {
    //   templateUrl: 'partials/game-control.html'
    // });
      
    $routeProvider.when('/control/:sessionId/:playerName', {
      templateUrl: 'partials/game-control.html'
    });

    $routeProvider.otherwise({redirectTo: '/'});

  }]);

});
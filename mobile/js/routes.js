'use strict';

define([
  'app',
  'controllers/game'
], function(app, game) {
  return app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'partials/control-intro.html', 
      controller: 'GameCtrl'
    });
      
    $routeProvider.otherwise({redirectTo: '/'});

  }]);

});
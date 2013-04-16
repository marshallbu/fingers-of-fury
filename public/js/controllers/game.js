'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persist the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */

define([
  'app'
], function (app) {
  app.controller('GameMenuCtrl', ['$scope', 'socket', '$location', '$routeParams', '$http',
    function GameMenuCtrl($scope, socket, $location, $routeParams, $http) {
      $scope.game = $scope.game || {};

      $http.get('api/createTable').success(function(response) {
        console.log('table data:', response);

        $scope.game.table = response;
      });

      $scope.game.name = 'test';

      socket.on('game:player:joined', function(data) {
        $location.path('/board');
      });
    }
  ]);

  app.controller('GameBoardCtrl', ['$scope', 'socket', '$routeParams', '$http',
    function GameBoardCtrl($scope, socket, $routeParams, $http) {
      // $scope.game = $scope.game || {};

      //
      
    }
  ]);

  return app;
});
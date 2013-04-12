'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persist the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */

define([
  'app'
], function (app) {
  return app.controller('GameMenuCtrl', ['$scope', '$routeParams', '$http',
    function GameMenuCtrl($scope, $routeParams, $http) {
      $scope.game = {};

      $http.get('api/createTable').success(function(response) {
        console.log('table data:', response);

        $scope.game.table = response;
      });

      $scope.game.name = 'test';
    }
  ]);
});
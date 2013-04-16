'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persist the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */

define([
  'app'
], function (app) {
  return app.controller('GameCtrl', ['$scope', 'socket', '$location', '$routeParams', '$http', '$log',
    function GameCtrl($scope, socket, $location, $routeParams, $http, $log) {
      $scope.game = $scope.game || {};
      $scope.namePattern = /^[a-z0-9_-]{3,15}$/;
      $scope.sessionId = null;

      if ($routeParams.sessionId) {
        var sessionId = $routeParams.sessionId;

        $http.get('/api/tableInfoBySession/' + sessionId)
          .success(function(response, status) {
            $log.log('table data:', response);

            if (response.error) {
              $log.error(response.error);
              $location.path('/');
            } else {
              $scope.game.table = response;
            }
          })
          .error(function(response, status) {
            $log.log('error retrieving table info for session' + sessionId, response);
            $location.path('/');
          });
      }
      
      $scope.playerJoin = function(player) {
        $log.log(player);

        // let's join the game
        $http.post('/api/joinTable', { tableId: $scope.game.table.id, name: player.name })
          .success(function(response, status) {
            $log.log(response);

            if (response.error) {
              $log.error(response.error);

            } else {
              socket.emit('game:player:join', {blah: 'yippy'});
            }
          })
          .error(function(response, status) {
            $log.error('error joining table ' + $scope.game.table.id, response);
          })
      };

      $scope.playerLeave = function() {

      };

    }
  ]);
});
/*global define: false */

define([
  'lodash',
  'underscore.string',
  'app'
], function (_, _s, app) {
  'use strict';
  return ['$scope', '$log', '$location', '$routeParams', 'music', 'socket', 'tableServices',
    function ($scope, $log, $location, $routeParams, music, socket, tableServices) {
      $scope.game.table = $scope.game.table || {};
      $scope.namePattern = function () {
        return /^[a-zA-Z0-9_-]{3,15}$/;
      };

      if ($routeParams.sessionId) {
        var promise = tableServices.getTableWithSession($routeParams.sessionId);
        promise.then(function (response) {
          $log.log('tableServices getTableWithSession response:', response);

          if (response.data.error) {
            $log.error(response.data.error);

            if (jQuery.browser.mobile) {
              $location.path('/error');
            } else {
              $location.path('/c/error');
            }
            
          } else {
            $scope.game.table = response.data;
          }
          // $scope.game.table = response.data;

          $scope.$apply();
        }, function (reason) {
          $log.log('tableServices getTableWithSession error:', reason);

        });
      } else {
        // no sessionId, send them to an error
        // console.dir($routeParams);
        $scope.error = {
          message: "Please get a valid game session!"
        };

        if (jQuery.browser.mobile) {
          $location.path('/error');
        } else {
          $location.path('/c/error');
        }
      }

      $scope.playerJoin = function(player) {
        $log.log(player);

        // let's join the game
        var promise = tableServices.joinTable($scope.game.table._id, player.name, $scope.game.table.session);
        promise.then(function (response) {
          $log.log('tableServices joinTable response:', response);

          var data = {
            tableId: $scope.game.table._id,
            name: player.name
          };
          socket.emit('game:player:join', data);
          $location.path('/control/' + $scope.game.table.session + '/' + player.name);

          $scope.$apply();
        }, function (reason) {
          $log.log('tableServices joinTable error:', reason);

        });
      };

      $scope.playerLeave = function() {
      };


      $scope.$apply();
    }
  ];
});
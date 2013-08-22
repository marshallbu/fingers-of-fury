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

      $scope.MOVE_ROCK = 'rock';
      $scope.MOVE_PAPER = 'paper';
      $scope.MOVE_SCISSORS = 'scissors';

      if ($routeParams.sessionId) {
        var promise = tableServices.getTableWithSession($routeParams.sessionId);
        promise.then(function (response) {
          $log.log('tableServices getTableWithSession response:', response);

          if (response.data.error) {
            $log.error(response.data.error);
            $location.path('/error');
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

      $scope.playerMove = function(move) {
        $log.log('move pressed:', move);

        var moveData = {
          tableId: $scope.game.table._id, 
          playerName: $scope.game.player.name, 
          playerMove: move
        };



      };

      $scope.playerLeave = function() {
        $log.log('player left game: ', $scope.game.player.name + ', session: ', $scope.game.table.session);

        var data = {
          name: $scope.game.player.name,
          sessionId: $scope.game.table.session
        };

        
      };

      socket.on('game:player:joined', function(data) {
        // $scope.game.table = Table.query({tableId: $scope.game.table._id});


      });

      // private stuff
      var _initGamePad = function() {
        // the game object scope should already be setup


      };




      $scope.$apply();
    }
  ];
});
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persist the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */

define([
  'app'
], function (app) {

  app.controller('GameMenuCtrl', ['$scope', 'socket', '$location', '$routeParams', '$http', '$log', 'Player',
    function GameMenuCtrl($scope, socket, $location, $routeParams, $http, $log, Player) {
      $scope.game = $scope.game || {};
      $scope.game.table = $scope.game.table || {};

      $http.get('api/createTable').success(function(response) {
        console.log('table data:', response);

        $scope.game.table = response;

        console.log(Player.query({tableId: $scope.game.table.id}));
      });

      $scope.game.name = 'test';

      socket.on('game:player:joined', function(data) {
        $location.path('/board/' + $scope.game.table.session);
      });
    }
  ]);

  app.controller('GameBoardCtrl', ['$scope', 'socket', '$location', '$routeParams', '$http', '$log', 'Player',
    function GameBoardCtrl($scope, socket, $location, $routeParams, $http, $log, Player) {
      $scope.game = $scope.game || {};
      var self = this;
      // $scope.debug = true;

      if ($routeParams.sessionId) {
        // this stuff should get lumped into an angular service
        var sessionId = $routeParams.sessionId;

        $http.get('/api/tableInfoBySession/' + sessionId)
          .success(function(response, status) {
            $log.log('table data:', response);

            if (response.error) {
              $log.error(response.error);
              $location.path('/');
            } else {
              $scope.game.table = response;

              _initBoard();
            }
          })
          .error(function(response, status) {
            $log.log('error retrieving table info for session' + sessionId, response);
            $location.path('/');
          });
      } else {

        _initBoard();
      }
     
      // checker for when to show stuff on the view
      $scope.shouldDisplayInfo = function() {
        var result = true;

        if (!$scope.game.table) {
          result = false;
        }
        else if (!($scope.game.table.playerCount) || $scope.game.table.playerCount <= 1) {
          result = false;
        }

        // $log.log('should display table? ', result);
        return result;
      }

      // display the current round, instead of the amount of rounds that have been played
      $scope.roundDisplay = function() {
        if ($scope.game.table) {
          return parseInt($scope.game.table.rounds) + 1;
        }
      }

      $scope.$on('$viewContentLoaded', function () {
        $log.log('content loaded?');
      });

      socket.on('game:player:joined', function(data) {
        $scope.game.players = Player.query({tableId: $scope.game.table.id});

        // should get our latest table stats from this
        console.log('after player join:', data);
        if (data.error) {
          $log.error(data.error);
        } else {
          $scope.game.table = data.tableStats;
        }
        
      });

      // private stuff
      var _initBoard = function() {
        // the game object scope should already be setup

        $scope.game.players = Player.query({tableId: $scope.game.table.id});

        $scope.game.playerOrderPredicate = 'lastJoined';
      };

    }
  ]);

  return app;
});
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persist the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */

define([
  'app'
], function (app) {
  
  app.controller('GameIntroCtrl', ['$scope', 'socket', '$location', '$routeParams', '$http', '$log',
    function GameIntroCtrl($scope, socket, $location, $routeParams, $http, $log) {
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
        $http.post('/api/joinTable', { tableId: $scope.game.table._id, name: player.name, sessionId: $routeParams.sessionId })
          .success(function(response, status) {
            $log.log(response);

            if (response.error) {
              $log.error(response.error, response.message);

            } else {
              var data = {
                tableId: $scope.game.table._id,
                name: player.name
              };
              socket.emit('game:player:join', data);
              $location.path('/control/' + $scope.game.table.session + '/' + player.name);
            }
          })
          .error(function(response, status) {
            $log.error('error joining table ' + $scope.game.table._id, response);
          });
      };

      $scope.playerLeave = function() {

      };
    }
  ]);

  app.controller('GamePadCtrl', ['$scope', 'socket', '$location', '$routeParams', '$http', '$log',
    function GamePadCtrl($scope, socket, $location, $routeParams, $http, $log) {
      $scope.game = $scope.game || {};

      $scope.MOVE_ROCK = 'rock';
      $scope.MOVE_PAPER = 'paper';
      $scope.MOVE_SCISSORS = 'scissors';

      if ($routeParams.sessionId && $routeParams.playerName) {
        // this stuff should get lumped into an angular service
        var sessionId = $routeParams.sessionId;
        var playerName = $routeParams.playerName;

        //get table
        $http.get('/api/tableInfoBySession/' + sessionId)
          .success(function(response, status) {
            $log.log('table data:', response);

            if (response.error) {
              $log.error(response.error);
              $location.path('/');
            } else {
              $scope.game.table = response;

              //get player
              $http.get('/api/playerInfoBySession/' + playerName + '/' + sessionId )
                .success(function(response, status) {
                  $log.log('player data:', response);

                  if (response.error) {
                    $log.error(response.error);
                    $location.path('/');
                  } else {
                    $scope.game.player = response;

                    _initGamePad();
                  }
                })
                .error(function(response, status) {
                  $log.log('error retrieving player info for session' + sessionId, response);
                  $location.path('/');
                });
            }
          })
          .error(function(response, status) {
            $log.log('error retrieving table info for session' + sessionId, response);
            $location.path('/');
          });

      } else {
        _initGamePad();
      }

      $scope.playerLeave = function() {
        
      };

      $scope.playerMove = function(move) {
        $log.log('move pressed:', move);

        var moveData = {
          tableId: $scope.game.table._id, 
          playerName: $scope.game.player.name, 
          playerMove: move
        };

        // let's join the game
        $http.post('/api/playMove', moveData)
          .success(function(response, status) {
            $log.log(response);

            if (response.error) {
              $log.error(response.error, response.message);

            } else {
              var data = {
                moveData: moveData
              };
              socket.emit('game:player:move', data);
              // $location.path('/control/' + $scope.game.table.session + '/' + player.name);
            }
          })
          .error(function(response, status) {
            $log.error('error playing move ' + $scope.game.table._id, response);
          });

      };

      socket.on('game:player:joined', function(data) {
        
        // $location.path('/control/' + $scope.game.table.session + '/' + $scope.game.player.name);
      });

      // private stuff
      var _initGamePad = function() {
        // the game object scope should already be setup


      };

    }
  ]);

  return app;
});
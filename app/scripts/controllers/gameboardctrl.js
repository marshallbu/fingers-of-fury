/*global define: false */

define([
  'lodash',
  'underscore.string',
  'app'
], function (_, _s, app) {
  'use strict';
  return ['$scope', '$log', '$location', '$routeParams', 'music', 'socket', 'tableServices', 'playerServices',
    function ($scope, $log, $location, $routeParams, music, socket, tableServices, playerServices) {
      $scope.game.table = $scope.game.table || {};
      $scope.game.round = $scope.game.round || {};
      // $scope.game.judgement = $scope.game.judgement || {};

      $scope.game.round.active = true;
      // $scope.game.judgement.active = false;
      $scope.game.playerOrderPredicate = 'lastJoined';

      if ($routeParams.sessionId) {
        var promise = tableServices.getTableWithSession($routeParams.sessionId);
        promise.then(function (response) {
          $log.log('tableServices getTableWithSession response:', response);

          $scope.game.table = response.data;
          _initBoard();


          $scope.$apply();
        }, function (reason) {
          $log.log('tableServices getTableWithSession error:', reason);

        });
      }

      $scope.displayRoundInfo = function() {
        var result = true;

        if (!$scope.game.table) {
          result = false;
        }
        else if (!($scope.game.table.players) || $scope.game.table.players.length <= 1) {
          result = false;
        }

        $log.log('should display table? ', result);
        return result;
      };

      // on player joined
      socket.on('game:player:joined', function(data) {

        // should get our latest table stats from this
        console.log('after player joined:', data);
        if (data.error) {
          $log.error(data.error);
        } else {
          $scope.game.table = data.table;

          _initBoard();
        }

        
      });

      // music handling for now
      music.pauseCurrent(); // pause anything currently playing just in case
      // music.play('round');

      // private stuff
      var _initBoard = function() {
        // the game object scope should already be setup
        var promise = playerServices.getPlayersOnTable($scope.game.table._id);
        promise.then(function (response) {
          $log.log('playerServices getPlayersOnTable response:', response);

          if (_.isEmpty($scope.game.players)) {
            // console.log('players empty');
            $scope.game.players = response.data;
          } else {

            var idsA = _.pluck(response.data, '_id');
            var idsB = _.pluck($scope.game.players, '_id');
            // console.log('ids', idsA, idsB);
            
            var newPlayers = _.difference(idsA, idsB);
            // console.log(newPlayers);
            
            _.each(response.data, function(player) {
              if (_.contains(newPlayers, player['_id'])) {
                $scope.game.players.push(player);
              }
            });
          }

          $scope.$apply();
        }, function (reason) {
          $log.log('playerServices getPlayersOnTable error:', reason);

        });


      };

      $scope.$apply();
    }
  ];
});
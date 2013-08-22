/*global define: false */
define([
  'angular'
], function (angular) {
  'use strict';

  angular.module('myApp.services', ['ngResource'])
    .value('version', '0.1.0')

    .factory('tableServices', ['$http', '$log', function($http, $log) {
      var service = {};

      service.generateTable = function () {
        $log.log('Calling createTable api');

        // return the call to return the promise
        return $http.get('api/createTable')
          .success(function(response, status, headers, config) {
            $log.log('createTable response', response);

            if (response.error) {
              $log.error(response.error);


            } else {
              return response;
            }
          })
          .error(function(response, status, headers, config) {

          });
      };

      service.getTableWithSession = function (sessionId) {
        $log.log('Calling tableInfoBySession api');

        return $http.get('/api/tableInfoBySession/' + sessionId)
          .success(function(response, status, headers, config) {
            $log.log('table data:', response);

            if (response.error) {
              $log.error(response.error);

              return response;
            } else {
              return response;
            }
          })
          .error(function(response, status, headers, config) {
            $log.log('error retrieving table info for session' + sessionId, response);

          });
      };

      service.joinTable = function (tableId, name, sessionId) {
        var data = { 
          tableId: tableId, 
          name: name, 
          sessionId: sessionId 
        };

        return $http.post('/api/joinTable', data)
          .success(function(response, status) {
            $log.log(response);

            if (response.error) {
              $log.error(response.error, response.message);

            } else {
              return response;
            }
          })
          .error(function(response, status) {
            $log.error('error joining table ' + tableId, response);
          });
      };

      return service;
    }])

    .factory('playerServices', ['$http', '$log', function($http, $log) {
      var service = {};

      service.getPlayersOnTable = function (tableId) {
        return $http.get('/api/tableInfo/' + tableId + '/players')
          .success(function(response, status) {
            $log.log(response);

            if (response.error) {
              $log.error(response.error, response.message);

            } else {
              return response;
            }
          })
          .error(function(response, status) {
            $log.error('error joining table ' + tableId, response);
          });
      };

      service.playMove = function(moveData) {
        return $http.post('/api/playMove', moveData)
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

      service.playerLeave = function(data) {
        return $http.post('/api/leaveTable', data)
          .success(function(resp, status) {
            $log.log(resp);

            if (resp.error) {
              $log.error(resp.error, resp.message);
            } else {
              var pdata = {
                data: data
              };
              socket.emit('game:player:leave', pdata);
              // $location.path('')
            }
          })
          .error(function(resp, status) {
            $log.error('error leaving table: ', $scope.game.player.name + ', session: ', $scope.game.table.session);
          });
      };
      
      return service;
    }]);

    // .factory('FeedService', ['$http', function($http) {
    //   return {
    //     parseFeed: function(url, count) {
    //       var numberOfFeeds = count || 6;
    //       return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=' + numberOfFeeds + '&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
    //     }
    //   };
    // }]);
});
'use strict';

/* Services */

define(['angular', 'app'], function (angular, app) {

  app.factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {  
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    };
  });

  angular.module('playerServices', ['ngResource'])
    .factory('Player', function($resource) {
      return $resource('/api/tableInfo/:tableId/players', {}, {
        query: {method: 'GET', params:{tableId: '@tableId'}, isArray: true}
      });
    });

  // app.factory('Player', function ())
  
  return app;
});
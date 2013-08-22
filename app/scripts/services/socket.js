/*global define: false */

define([
  'lodash',
  'underscore.string',
  'angular',
  'app'
], function (_, _s, angular, app) {
  'use strict';

  angular.module('myApp.socket-io', [])
    //service that handles socket
    .factory('socket', function ($rootScope) {
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

});
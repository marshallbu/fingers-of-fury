'use strict';

/* Services */

define([
  'angular',
  'app'
], function (angular, app) {

  //service that handles socket
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

  //service that handles music
  app.factory('music', function($rootScope) {

    var $mediaIntro = $('<audio id="introMusic"></audio>')
      .append('<source src="/assets/sounds/bgm-theme-loop.ogg" type="audio/ogg" />')
      .append('<source src="/assets/sounds/bgm-theme-loop.mp3" type="audio/mpeg" />')
      .append('Your browser does not support the audio tag.');

    var $mediaRound = $('<audio id="roundMusic"></audio>')
      .append('<source src="/assets/sounds/bgm-in-turn.ogg" type="audio/ogg" />')
      .append('<source src="/assets/sounds/bgm-in-turn.mp3" type="audio/mpeg" />')
      .append('Your browser does not support the audio tag.');

    var success = function(mediaElement, domObject) {  
      // add event listener
      mediaElement.addEventListener('ended', function(e) {
          mediaElement.play();
      }, false);
      // mediaElement.play();
    };

    var error = function() {

    };

    var mediaElements = {
      'intro': new MediaElement($mediaIntro.get(0), {
        startVolume: 1,
        success: success,
        error: error
      }),
      'round': new MediaElement($mediaRound.get(0), {
        startVolume: 1,
        success: success,
        error: error
      })
    };

    return {
      play: function(name) {
        mediaElements[name].play();
      },
      pause: function(name) {
        mediaElements[name].pause();
      },
      pauseCurrent: function() {
        var playing = _.filter(mediaElements, function(element) {
          return element.paused === false;
        });

        _.each(playing, function(element) {
          element.pause();
        });
        
      }
    };

  });

  //service that handles sound effects
  app.factory('effects', function($rootScope) {
    //TODO: make an effects service as well that handles playing/pausing sound effects
    
    var mediaElements = {
      
    };

    return {
      play: function(name) {
        mediaElements[name].play();
      },
      pause: function(name) {
        mediaElements[name].pause();
      },
      pauseCurrent: function() {
        var playing = _.filter(mediaElements, function(element) {
          return element.paused === false;
        });

        _.each(playing, function(element) {
          element.pause();
        });
        
      }
    };
  });

  angular.module('playerServices', ['ngResource'])
    .factory('Player', function($resource) {
      return $resource('/api/tableInfo/:tableId/players', {}, {
        query: {method: 'GET', params:{tableId: '@tableId'}, isArray: true}
      });
    });
  
  return app;
});
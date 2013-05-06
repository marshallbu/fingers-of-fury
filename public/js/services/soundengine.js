'use strict';

/* Services */

define([
  'angular',
  'app'
], function (angular, app) {

  /**
   * Music and Sound Effects service engines
   *
   */

  // default things used by both engines


  //service that handles music
  app.factory('music', function($rootScope) {
    var success = function(mediaElement, domObject) {  
      // add event listener
      mediaElement.addEventListener('ended', function(e) {
          mediaElement.play();
      }, false);
      // mediaElement.play();
    };

    var error = function() {
    };

    var options = {
      startVolume: 0.5,
      success: success,
      error: error,
      // shows debug errors on screen
      enablePluginDebug: false,
      // remove or reorder to change plugin priority
      plugins: ['flash','silverlight'],
      // path to Flash and Silverlight plugins
      pluginPath: '/assets/',
      // name of flash file
      flashName: 'flashmediaelement.swf',
      // name of silverlight file
      silverlightName: 'silverlightmediaelement.xap'
    };


    var $mediaIntro = $('<audio id="introMusic"></audio>')
      .append('<source src="/assets/music/bgm-theme-loop.ogg" type="audio/ogg" />')
      .append('<source src="/assets/music/bgm-theme-loop.mp3" type="audio/mpeg" />')
      .append('Your browser does not support the audio tag.');

    var $mediaRound = $('<audio id="roundMusic"></audio>')
      .append('<source src="/assets/music/bgm-in-turn.ogg" type="audio/ogg" />')
      .append('<source src="/assets/music/bgm-in-turn.mp3" type="audio/mpeg" />')
      .append('Your browser does not support the audio tag.');

    var mediaElements = {
      'intro': new MediaElement($mediaIntro.get(0), options),
      'round': new MediaElement($mediaRound.get(0), options)
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
    var success = function(mediaElement, domObject) {  
      // add event listener
      mediaElement.addEventListener('ended', function(e) {
          // mediaElement.play();
      }, false);
      // mediaElement.play();
    };

    var error = function() {
    };

    var options = {
      startVolume: 1,
      success: success,
      error: error,
      // shows debug errors on screen
      enablePluginDebug: false,
      // remove or reorder to change plugin priority
      plugins: ['flash','silverlight'],
      // path to Flash and Silverlight plugins
      pluginPath: '/assets/',
      // name of flash file
      flashName: 'flashmediaelement.swf',
      // name of silverlight file
      silverlightName: 'silverlightmediaelement.xap'
    };

    var $sfxDraw = $('<audio id=""></audio>')
      .append('<source src="/assets/sfx/judgement-draw.ogg" type="audio/ogg" />')
      .append('<source src="/assets/sfx/judgement-draw.mp3" type="audio/mpeg" />')
      .append('Your browser does not support the audio tag.');

    var $sfxWin = $('<audio id=""></audio>')
      .append('<source src="/assets/sfx/judgement-win.ogg" type="audio/ogg" />')
      .append('<source src="/assets/sfx/judgement-win.mp3" type="audio/mpeg" />')
      .append('Your browser does not support the audio tag.');

    var $sfxPunch1 = $('<audio id=""></audio>')
      .append('<source src="/assets/sfx/sfx-punch1.ogg" type="audio/ogg" />')
      .append('<source src="/assets/sfx/sfx-punch1.mp3" type="audio/mpeg" />')
      .append('Your browser does not support the audio tag.');

    var $sfxPunch2 = $('<audio id=""></audio>')
      .append('<source src="/assets/sfx/sfx-punch2.ogg" type="audio/ogg" />')
      .append('<source src="/assets/sfx/sfx-punch2.mp3" type="audio/mpeg" />')
      .append('Your browser does not support the audio tag.');

    var $sfxPunch3 = $('<audio id=""></audio>')
      .append('<source src="/assets/sfx/sfx-punch3.ogg" type="audio/ogg" />')
      .append('<source src="/assets/sfx/sfx-punch3.mp3" type="audio/mpeg" />')
      .append('Your browser does not support the audio tag.');

    var $sfxPunch4 = $('<audio id=""></audio>')
      .append('<source src="/assets/sfx/sfx-punch4.ogg" type="audio/ogg" />')
      .append('<source src="/assets/sfx/sfx-punch4.mp3" type="audio/mpeg" />')
      .append('Your browser does not support the audio tag.');

    var $sfxVoiceTitle = $('<audio id=""></audio>')
      .append('<source src="/assets/sfx/voice-fingers-of-fury.ogg" type="audio/ogg" />')
      .append('<source src="/assets/sfx/voice-fingers-of-fury.mp3" type="audio/mpeg" />')
      .append('Your browser does not support the audio tag.');

    var mediaElements = {
      'judgement-win': new MediaElement($sfxDraw.get(0), options),
      'judgement-draw': new MediaElement($sfxWin.get(0), options),
      'punch1': new MediaElement($sfxPunch1.get(0), options),
      'punch2': new MediaElement($sfxPunch2.get(0), options),
      'punch3': new MediaElement($sfxPunch3.get(0), options),
      'punch4': new MediaElement($sfxPunch4.get(0), options),
      'voice-title': new MediaElement($sfxVoiceTitle.get(0), options)
    };

    return {
      play: function(name) {
        mediaElements[name].play();
      },
      pause: function(name) {
        mediaElements[name].pause();
      },
      pauseCurrent: function() {
        // find anything currently playing
        var playing = _.filter(mediaElements, function(element) {
          return element.paused === false;
        });

        _.each(playing, function(element) {
          element.pause();
        });
        
      }
    };
  });


  return app;
});
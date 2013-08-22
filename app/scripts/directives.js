define([
  'angular'
], function(angular) {
  'use strict';

  angular.module('myApp.directives', ['myApp.services'])
    .directive('appVersion', ['version', function(version) {
      return function(scope, el, attrs) {
        el.text(version);
      };
    }])

    .directive('resizeView', ['$log', function($log) {
      return {
        priority: 20,
        link: function(scope, element, attrs, controller) {
          (function() {
            var $window = $(window);
            var $mainView = $(element[0]);

            if (!jQuery.browser.mobile) {
              var resizePage = function() {
                var winHeight = $window.height();
                $mainView.css({'height': winHeight - 20 + 'px'});
              };
              $window.resize(resizePage);
              resizePage();
            }
          }());
        }
      };
    }])

    .directive('introInit', ['$log', function($log) {
      return {
        priority: 19,
        link: function(scope, element, attrs, controller) {

          (function() {
            // TODO: find a better pattern for this, like adding it to $rootScope or 
            // maybe defining a singleton service?
            var $window = $(window);

            var $section = $(element[0]);

            var alignIntro = function() {
              var winHeight = $window.height();
              var introHeight = $section.height();

              if (winHeight > 0 && (winHeight - introHeight) > 0) {
                $section.css('position', 'relative');
                $section.css('top', function() {
                  return ((winHeight / 2) - (introHeight / 2)) + 'px';
                });

              }
            };

            $window.resize(alignIntro);
            alignIntro();
          }());
            
        }
      };
    }])

    .directive('introGestures', ['$log', function($log) {
      return {
        link: function(scope, element, attrs, controller) {
          var $element = $(element[0]);

          $element.find('img').addClass('animated bounceIn');

        }
      };
    }])

    .directive('boardStatus', ['$log', function($log) {
      return {
        link: function(scope, element, attrs, controller) {
          var $window = $(window); 
          var $element = $(element[0]);

          var $gameBoardView = $('section.game-board-view');

          var alignTableInfo = function() {
            var viewHeight = $gameBoardView.height(); console.log(viewHeight);
            var infoHeight = $element.height(); console.log(infoHeight);

            if (viewHeight > 0 && (viewHeight - infoHeight) > 0) {
              $element.css('position', 'relative');
              $element.css('top', function() {
                return ((viewHeight / 2) - (infoHeight / 2)) + 'px';
              });
            }
          };

          $window.resize(alignTableInfo);
          alignTableInfo();
        }
      };
    }])

    .directive('playerEnter', ['$log', function($log) {
      return {
        link: function(scope, element, attrs, controller) {
          var $element = $(element[0]);

          if ($element.is('.player:nth-child(1)')) {
            $element.addClass('animated bounceInUp');
          }
          if ($element.is('.player:nth-child(2)')) {
            $element.addClass('animated bounceInDown');
          }
          if ($element.is('.player:nth-child(3)')) {
            $element.addClass('animated bounceInRight');
          }
          if ($element.is('.player:nth-child(4)')) {
            $element.addClass('animated bounceInLeft');
          }

        }
      };
    }])

    .directive('pulseInfinite', ['$log', function($log) {
      return {
        link: function(scope, element, attrs, controller) {
          var $element = $(element[0]);

          $element.addClass('animated pulse');
          $element.css({
              '-webkit-animation-duration': '2s',
              '-webkit-animation-delay': '0s',
              '-webkit-animation-iteration-count': 'infinite',
              '-moz-animation-duration': '2s',
              '-moz-animation-delay': '0s',
              '-moz-animation-iteration-count': 'infinite',
              '-ms-animation-duration': '2s',
              '-ms-animation-delay': '0s',
              '-ms-animation-iteration-count': 'infinite',

            });
        }
      };
    }])

    // don't pass any empty dependencies in here or Angular will error out, 
    // leave anon function as second parameter or just as only entry in an array
    .directive('focus', [function(){
      // Runs during compile
      return {
        // name: '',
        // priority: 1,
        // terminal: true,
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        // cont­rol­ler: function($scope, $element, $attrs, $transclue) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        // template: '',
        // templateUrl: '',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, element, attrs, controller) {
          element[0].focus();
        }
      };
    }]);
});
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

    .directive('intro-init', [function() {
      return {
        link: function($scope, element, attrs, controller) {
          console.debug(element);
        };
      }
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
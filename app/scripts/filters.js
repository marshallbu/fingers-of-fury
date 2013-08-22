/*global define: false */
define(['angular'], function (angular) {
  'use strict';

  angular.module('myApp.filters', ['myApp.services'])
    .filter('interpolate', ['version', function(version) {
      return function(text) {
        return String(text).replace(/\%VERSION\%/mg, version);
      };
  }]);
});
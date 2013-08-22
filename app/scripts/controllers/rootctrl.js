/*global define: false */

define([
  'lodash',
  'underscore.string',
  'app'
], function (_, _s, app) {
  'use strict';
  return ['$scope', '$log', '$location',
    function ($scope, $log, $location) {
      // $scope.window = $(window);
      $scope.isMobile = jQuery.browser.mobile;

      // setup game namespace, all other controllers will inherit this 
      $scope.game = $scope.game || {};

      $scope.$apply();
    }
  ];
});
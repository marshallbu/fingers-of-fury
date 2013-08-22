/*global define: false, require: false */
define([
  'angular'
], function (angular) {
  'use strict';

  return angular.module('myApp.controllers', ['myApp.services'])
    // Sample controller where service is being used
    // .controller('MyCtrl1', ['$scope', 'version', function ($scope, version) {
    //   $scope.scopedAppVersion = version;
    // }])
    // More involved example where controller is required from an external file

    .controller('RootCtrl', ['$scope', '$location', function($scope, $location) {
      require(['controllers/rootctrl'], function(rootctrl) {
        angular.injector(['ng']).invoke(rootctrl, this, {
          '$scope': $scope,
          '$location': $location
        });
      });
    }])

    // desktop
    .controller('GameIntroCtrl', [
        '$scope', 
        '$location', 
        'music', 
        'socket',
        'tableServices',
        function($scope, $location, music, socket) {
      require(['controllers/gameintroctrl'], function(gameintroctrl) {
        angular.injector(['ng', 'myApp.services']).invoke(gameintroctrl, this, {
          '$scope': $scope,
          '$location': $location,
          'music': music,
          'socket': socket
        });
      });
    }])

    // desktop
    .controller('GameBoardCtrl', [
        '$scope', 
        '$location', 
        '$routeParams',
        'music', 
        'socket',
        'tableServices',
        'playerServices',
        function($scope, $location, $routeParams, music, socket) {
      require(['controllers/gameboardctrl'], function(gameboardctrl) {
        angular.injector(['ng', 'ngResource', 'myApp.services']).invoke(gameboardctrl, this, {
          '$scope': $scope,
          '$location': $location,
          '$routeParams': $routeParams,
          'music': music,
          'socket': socket
        });
      });
    }])

    .controller('GamePadCtrl', [
        '$scope', 
        '$location', 
        '$routeParams',
        'music', 
        'socket',
        'tableServices',
        function($scope, $location, $routeParams, music, socket) {
      require(['controllers/mobile/gamepadctrl'], function(gamepadctrl) {
        angular.injector(['ng', 'myApp.services']).invoke(gamepadctrl, this, {
          '$scope': $scope,
          '$location': $location,
          '$routeParams': $routeParams,
          'music': music,
          'socket': socket
        });
      });
    }])

    .controller('GamePadControlCtrl', [
        '$scope', 
        '$location', 
        '$routeParams',
        'music', 
        'socket',
        'tableServices',
        function($scope, $location, $routeParams, music, socket) {
      require(['controllers/mobile/gamepadcontrolctrl'], function(gamepadcontrolctrl) {
        angular.injector(['ng', 'myApp.services']).invoke(gamepadcontrolctrl, this, {
          '$scope': $scope,
          '$location': $location,
          '$routeParams': $routeParams,
          'music': music,
          'socket': socket
        });
      });
    }]);


    // .controller('FooterCtrl', ['$scope', function($scope) {
    //   require(['controllers/footerctrl'], function(footerctrl) {
    //     angular.injector(['ng', 'myApp.services']).invoke(footerctrl, this, {'$scope': $scope});
    //   });
    // }]);
});
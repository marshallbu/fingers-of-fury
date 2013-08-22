/*global define: false */

define([
  'lodash',
  'underscore.string',
  'app'
], function (_, _s, app) {
  'use strict';
  return ['$scope', '$log', '$location', 'music', 'socket', 'tableServices',
    function ($scope, $log, $location, music, socket, tableServices) {
      $scope.game.table = $scope.game.table || {};
      $log.log('Inside of GameIntroCtrl');

      var promise = tableServices.generateTable();
      promise.then(function (response) {
        $log.log('tableServices generateTable response:', response);

        $scope.game.table = response.data;

        $scope.$apply();
      }, function (reason) {
        $log.log('tableServices generateTable error:', reason);

      });

      // music handling for now
      music.pauseCurrent(); // pause anything currently playing just in case
      music.play('intro');

      // socket io events
      socket.on('game:player:joined', function(data) {
        $location.path('/board/' + $scope.game.table.session);
      });

      $scope.$apply();
    }
  ];
});
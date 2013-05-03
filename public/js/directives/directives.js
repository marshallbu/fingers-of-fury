'use strict';

/* Directives */

define(['angular', 'app'], function (angular, app) {

  app.directive('playerInfo', function() {
    return function(scope, element, attrs) {

      

    };
  });

  app.directive('tableInfo', function() {
    return function (scope, element, attrs) {
      var $window = $(window); 
      // scope.$window = scope.$window || $(window); //wonder if i can cache this in the scope somewhere

      var $tableStatusDiv = $('div.game-status-container');

      var alignTableInfo = function() {
        var winHeight = $window.height();
        var infoHeight = $tableStatusDiv.height();

        if (winHeight > 0 && (winHeight - infoHeight) > 0) {
          $tableStatusDiv.css('position', 'relative');
          $tableStatusDiv.css('top', function() {
            return ((winHeight / 2) - (infoHeight / 2)) + 'px';
          });
        }
      };

      var initTableInfo = function() {

        // $tableStatusDiv.find('div.table-info div.table-session').text(scope.game.table.session);

        alignTableInfo($window, $tableStatusDiv);
      }

      scope.$watch('game.table', function(){
        if (scope.game.table) {
          // $tableStatusDiv.find('div.table-info div.table-session').text(scope.game.table.session);
        }

        alignTableInfo($window, $tableStatusDiv);
        // console.log('tester');
      });

      $window.resize(alignTableInfo);

      initTableInfo();
    };
  });

  return app;
});
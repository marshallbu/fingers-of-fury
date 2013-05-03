'use strict';

/* Directives */

define(['angular', 'app'], function (angular, app) {

  app.directive('controllerInfo', function() {
    return function (scope, element, attrs) {
      var $window = $(window); 

      scope.$watch('game.table', function(){
        if (scope.game.table) {
          // in the event that we need to do anything elsewhere on a table change

        }

        console.log('directive controllerInfo: table changed via watch', scope.game.table);
      });


    };
  });

  return app;
});
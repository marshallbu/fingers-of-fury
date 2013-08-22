/*global define: false */
define([
  'angular',
  'app'
], function(angular, app) {
  'use strict';

  var getBrowser = function () {
      return jQuery.browser.mobile ? 'mobile' : 'desktop';
  };

  return app.config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/', {
      templateUrl: 'views/' + getBrowser() + '/main.html'
    });

    // let's override the mobile controller here so I can test on desktop
    $routeProvider.when('/c/error', {
      templateUrl: 'views/mobile/error.html'
    });

    $routeProvider.when('/c', {
      templateUrl: 'views/mobile/error.html'
    });

    $routeProvider.when('/c/:sessionId', {
      templateUrl: 'views/mobile/main.html'
    });

    $routeProvider.when('/c/control/:sessionId/:playerName', {
      templateUrl: 'views/mobile/control.html'
    });

    if (getBrowser() === 'mobile') {
      $routeProvider.when('/error', {
        templateUrl: 'views/mobile/error.html'
      });
      
      $routeProvider.when('/:sessionId', {
        templateUrl: 'views/mobile/main.html'
      });

      $routeProvider.when('/control/:sessionId/:playerName', {
        templateUrl: 'views/mobile/control.html'
      });

    } else {
      $routeProvider.when('/:sessionId', {
        templateUrl: 'views/desktop/board.html'
      });

      $routeProvider.when('/board/:sessionId', {
        templateUrl: 'views/desktop/board.html'
      });
      
    }

    

    // $routeProvider.when('/results', {
    //   templateUrl: 'partials/results-classification.html'
    // });

    $routeProvider.otherwise({redirectTo: '/'});

  }]);

});
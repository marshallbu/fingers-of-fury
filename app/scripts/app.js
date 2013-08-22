/*global define: false */
define([
  'angular',
  'services',
  'directives',
  'controllers',
  'filters',
  'mediaelement',
  'io',
  'services/soundengine',
  'services/socket'
  ], function (angular, services, directives, controllers, filters) {
    'use strict';

    /* this is setting up an angular module to be used in our app
     */
    return angular.module('myApp', [
      'ngResource',
      'myApp.services', 
      'myApp.directives', 
      'myApp.controllers', 
      'myApp.filters', 
      'myApp.soundEngine', 
      'myApp.socket-io'
    ]);
});
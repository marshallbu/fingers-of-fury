"use strict";define(["angular","app"],function(e,t){t.directive("controllerInfo",function(){return function(e,t,n){var r=$(window);e.$watch("game.table",function(){e.game.table;console.log("directive controllerInfo: table changed via watch")});r.resize(alignTableInfo);initTableInfo()}});return t});
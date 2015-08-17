'use strict';

angular.module('chApp.practice.services').factory('roomsService',
[
    "$state", "$http", "$rootScope", '$cookies', '$q', "appConfig",
    function ($state, $http, $rootScope, $cookies, $q, appConfig) {

        var service = {};
        var _apiName = "/api/Employees/";

        
        return service;
    }
]);
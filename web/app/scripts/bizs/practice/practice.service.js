'use strict';

angular.module('chApp.practice.services').factory('practiceService', ["$state", "$http", "appConfig", function ($state, $http, appConfig) {
	var service = {};

	service.getPractice = function (id, practiceLicenseCode) {
        return {};
    };

	return service;
}]);
'use strict';

angular.module('chApp.practice.services').factory('basicInfoService',
[
    "$state", "$http", "$rootScope", '$cookies', '$q', "appConfig",
    function($state, $http, $rootScope, $cookies, $q, appConfig) {

        var service = {};
        var _apiName = "/practices/";

        //获取某个Practice
        service.getPractice = function(practiceId) {
            var promise = null;
            if (!practiceId) {
                var deferred = $q.defer();
                setTimeout(function() {
                    deferred.reject("未指定机构Id。");
                }, 500);
                promise = deferred.promise;
            } else {
                promise = $http.get(appConfig.API_HOST + _apiName + practiceId);
            }

            return promise;
        };
        service.getPracticeOfCurrentUser = function() {
            var token = $cookies[appConfig.CH_AU_T_NAME];
            var promise = null;
            if (!token) {
                var deferred = $q.defer();
                setTimeout(function() {
                    deferred.reject("当前用户未登陆。");
                }, 500);
                promise = deferred.promise;
            } else {
                promise = $http.get(appConfig.API_HOST + _apiName + "current");
            }

            return promise;
        };

        service.updatePractice = function (practiceId, practiceDto) {
            var promise = null;
            if (!practiceDto) {
                var deferred = $q.defer();
                setTimeout(function () {
                    deferred.reject("没有机构信息。");
                }, 500);
                promise = deferred.promise;
            } else {
                var data = practiceDto;
                promise = $http.put(appConfig.API_HOST + _apiName + practiceId, data);
            }

            return promise;
        };

        service.uploadPracticeFile = function (fileId, fileName, fileData) {
            var promise = null;
            if (!fileData) {
                var deferred = $q.defer();
                setTimeout(function () {
                    deferred.reject("未选择数据文件。");
                }, 500);
                promise = deferred.promise;
            } else {
                var data = {
                    id: fileId,
                    fileNaame: fileName,
                    fileData: fileData
                };
                promise = $http.post(appConfig.API_HOST + "/practice-files/", data);
            }

            return promise;
        };

        service.getPracticeFile = function(fileId){
            var promise = $http.get(appConfig.API_HOST + "/practice-files/" + fileId);
            return promise;
        };
        service.getPracticeFileUrl = function(fileData, fileId) {
            if (fileId) {
                return appConfig.API_HOST + _apiName + "PracticeFile/" + fileId;
            } else {
                return fileData || "images/certificate.svg";
            }
        };

        return service;
    }
]);
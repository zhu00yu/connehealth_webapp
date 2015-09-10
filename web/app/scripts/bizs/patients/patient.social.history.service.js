'use strict';

angular.module('chApp.patients.services').factory('patientSocialHistoriesService', [
    '$http', '$state', '$cookies', '$rootScope', "appConfig",
    function ($http, $state, $cookies, $rootScope, appConfig) {
    var service = {};
    var oElements = {};
    var _apiName = "/patient-social-histories/";
    //获取全部患者
    service.getSocialHistories = function (patientId) {
        return $http.get(appConfig.API_HOST + _apiName + "list/" + patientId)
                    .then(getComplete)
                    .catch(getFailed);

        function getComplete(response) {
            var data = response.data;
            _.each(data, function(d){
                d.startDate = moment(d.startDate).format("YYYY-MM-DD");
            });
            return data;
        }
        function getFailed(error) {
            alert('XHR Failed for getSocialHistories.' + error.data);
        }
    };
    service.getSocialHistory = function (historyId) {
        return $http.get(appConfig.API_HOST + _apiName + historyId)
                    .then(getComplete)
                    .catch(getFailed);

        function getComplete(response) {
            var data = response.data;
            d.startDate = moment(d.startDate).format("YYYY-MM-DD");
            return data;
        }
        function getFailed(error) {
            //alert('XHR Failed for getPatients.' + error.data);
        }
    };

    service.insertSocialHistory = function (patientId, history) {
        var promise = null;
        if (!patientId) {
            var deferred = $q.defer();
            setTimeout(function () {
                deferred.reject("未指定机构Id。");
            }, 500);
            promise = deferred.promise;
        } else {
            promise = $http.post(appConfig.API_HOST + _apiName, history);
        }

        return promise;
    }

    service.updateSocialHistory = function (patientId, history) {
        var promise = null;
        if (!patientId) {
            var deferred = $q.defer();
            setTimeout(function () {
                deferred.reject("未指定机构Id。");
            }, 500);
            promise = deferred.promise;
        } else {
            promise = $http.put(appConfig.API_HOST + _apiName + history.id, history);
        }

        return promise;
    }

    return service;
}]);
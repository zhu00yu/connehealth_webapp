'use strict';

angular.module('chApp.charts.services').factory('patientService', ['$http', "appConfig", function ($http, appConfig) {
    var service = {};
    var _apiName = "/patients/";
    //获取全部患者
    service.getPatients = function (searchCondition) {
        return $http.get(appConfig.API_HOST + _apiName)
                    .then(getPatientsComplete)
                    .catch(getPatientsFailed);

        function getPatientsComplete(response) {
            return response.data;
        }
        function getPatientsFailed(error) {
            alert('XHR Failed for getPatients.' + error.data);
        }
    };
    //获取某个患者
    service.getPatientSummary = function (patientId) {
        return $http.get(appConfig.API_HOST + _apiName + patientId + '/summary')
                    .then(getPatientSummaryComplete)
                    .catch(getPatientSummaryFailed);

        function getPatientSummaryComplete(response) {
            return response.data;
        }
        function getPatientSummaryFailed(error) {
            alert('XHR Failed for getPatientSummary.' + error.data);
        }
    };
    //添加某个患者
    service.addPatient = function (patientDto) {
        return $http.post(appConfig.API_HOST + _apiName, patientDto)
                    .then(addPatientSummaryComplete)
                    .catch(addPatientSummaryFailed);

        function addPatientSummaryComplete(response) {
            return response.data;
        }
        function addPatientSummaryFailed(error) {
            alert('XHR Failed for addPatient.' + JSON.stringify(error.data));
        }
    }
    //保存某个患者
    service.savePatient = function (patient) {
        return $http.put(appConfig.API_HOST + _apiName, patient)
                    .then(savePatientSummaryComplete)
                    .catch(savePatientSummaryFailed);

        function savePatientSummaryComplete(response) {
            return response.data;
        }
        function savePatientSummaryFailed(error) {
            alert('XHR Failed for savePatient.' + JSON.stringify(error.data));
        }
    }

    service.getPatientFileUrl = function (fileData, fileId) {
        if (fileId) {
            return appConfig.API_HOST + "/patient-files/" + fileId;
        } else {
            return fileData || "images/patient.svg";
        }
    };


    return service;
}]);
'use strict';
angular.module('chApp.patients.controllers').controller('NewPatientController', [
    '$scope','$rootScope', '$q', '$state', '$stateParams', '$location', '$timeout', 'pluginsService', 'tabService', 'patientService', 'applicationService',
    function ($scope, $rootScope, $q, $state, $stateParams, $location, $timeout, pluginsService, tabService, patientService, applicationService) {

        tabService.openTab('patients', $location.$$path, '添加患者', { stateName: $state.current.name, stateParams: $stateParams }, true);
        var element = tabService.getTabPanel();
        var oElements = {};
        $scope.dto = {};
        $scope.dto.patient = {};
        var watchHandler = $rootScope.$watch("currentUser.practiceId", function (newValue, oldValue) {
            if (newValue) {
                var user = $rootScope.currentUser || {};
                $scope.dto.patientPhotoFileUrl = patientService.getPatientFileUrl();
                watchHandler();
            }
        });
        $scope.$watch("dto.patient.patientName", function(newValue, oldValue){
            if (newValue){
                var names = patientService.getPatientNames(newValue);
                $scope.dto.patient.familyName = names.familyName;
                $scope.dto.patient.givenName = names.givenName;
            }
        });
        $scope.gotoDetails = function(id){
            var url = $location.$$path;
            $state.go("biz.patients.details", {patientId: id || 0});
            $timeout(function(){
                tabService.closeTab('patients', url, true);
            }, 200);
        };

        $scope.submitPatientInfo = function(){
            var data = $scope.dto;
            var patient = data.patient;
            var photoFileId = data.patientPhotoFileId;
            var photoFileData = data.patientPhotoFileData;
            var photoFileName = data.patientPhotoFileName || "PATIENT_PHOTO.JPG";

            var promises = [];
            if (photoFileData) {
                var promise = patientService.uploadPatientFile(photoFileId, photoFileName, photoFileData).then(function(result) {
                    data.patientPhotoFileId = +result.data;
                    patient.photoId = +result.data;
                }, function(result) {
                    console.log(arguments);
                    promise.reject(result.data);
                });
                promises.push(promise);
            }
            $q.all(promises).then(function(){
                patientService.addPatient(patient).then(function (result) {
                    $scope.gotoDetails(result.data);
                }, function() {
                    console.log(arguments);
                });
            });

        };


    }
]);
angular.module('chApp.patients.controllers').controller('PatientDetailsController', [
    '$scope','$rootScope', '$q', '$state', '$stateParams', '$location', 'pluginsService', 'tabService', 'patientService', 'applicationService',
    function ($scope, $rootScope, $q, $state, $stateParams, $location, pluginsService, tabService, patientService, applicationService) {
        //加载tab页
        //tabService.openTab('charts', $state.current.name, $location.$$path, $stateParams, 'Patient lists', false);
        tabService.openTab('patients', $location.$$path, '患者信息', { stateName: $state.current.name, stateParams: $stateParams }, true);

        $scope.isEditing = false;
        $scope.patientId = $stateParams.patientId;
        $scope.isActive = function (viewLocation) {
            return viewLocation === $state.current.name;
        };
        $scope.editPatientProfile = function(){
            $scope.isEditing = true;
        };
        $scope.cancelProfileEditing = function(){
            $scope.isEditing = false;
            $scope.dto = deepcopy(original);
        };

        $scope.dto = {};
        $scope.dto.patient = {};

        var original = {};
        function getPatient(patientId){
            patientService.getPatient(patientId).then(function(result){
                var patient = result;
                patient.dob = moment(+patient.dob).format('YYYY-MM-DD');
                $scope.dto.patient = result;
                var photoId = result.photoId;
                patientService.getPatientFile(photoId).success(function(result){
                    original = {
                        patient:patient,
                        patientPhotoFileId:result.id,
                        patientPhotoFileName:result.fileName,
                        patientPhotoFileData:result.fileData,
                        patientPhotoFileUrl:patientService.getPatientFileUrl(result.fileData)
                    };
                    $scope.dto = deepcopy(original);
                });
            });
        }
        getPatient($scope.patientId);

        $scope.savePatientProfile = function(){
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
                var patientId = $scope.patientId;
                patientService.savePatient(patientId, patient).then(function (result) {
                    $scope.isEditing = false;
                    getPatient(patientId);
                }, function() {
                    console.log(arguments);
                });
            });
        };

    }
]);
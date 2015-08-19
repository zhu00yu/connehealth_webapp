angular.module('chApp.charts.controllers').controller('PatientsController', ['$scope', '$state', '$stateParams', '$location', 'applicationService', 'tabService', 'patientService',
    function ($scope, $state, $stateParams, $location, applicationService, tabService, patientService) {
        tabService.closeAll('charts.patients');

        var patientId = $stateParams.patientId;
        console.log('PatientsController' + ',' + $location.$$path);
        //创建view model
        var vm = {};
        $scope.vm = vm;

        //加载患者summary数据
        applicationService.blockUI();
        patientService.getPatientSummary(patientId)
            .then(function (data) {
                console.log('PatientsController.data' + ',' + $location.$$path);
                if (data) {
                    vm.Patient = data.Patient;
                    vm.PatientPhotoFileData = data.PatientPhotoFileData;
                    vm.PatientPhotoFileId = data.PatientPhotoFileId;
                    vm.PatientPhotoFileUrl = patientService.getPatientFileUrl(data.PatientPhotoFileData);
                    tabService.openTab('charts', 'charts/patients/' + patientId, vm.Patient.PatientName, { stateName: 'charts.patients', stateParams: { patientId: patientId } }, true);
                }
            })
            .finally(function () {
                //加载插件(for select2)
                //pluginsService.init();
                applicationService.unblockUI();
            });

        $scope.$on("Photo_File_Data_Change", function(event, data) {
            vm.PatientPhotoFileData = data.PatientPhotoFileData;
            vm.PatientPhotoFileUrl = patientService.getPatientFileUrl(data.PatientPhotoFileData);
        });

    }
]);
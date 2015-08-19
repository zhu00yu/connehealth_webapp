angular.module('chApp.charts.controllers').controller('PatientSummaryController', ['$scope', '$state', '$stateParams', '$location', 'applicationService', 'tabService', 'patientService',
    function ($scope, $state, $stateParams, $location, applicationService, tabService, patientService) {
        console.log('PatientSummaryController' + ',' + $location.$$path);
        var patientId = $stateParams.patientId;

        //创建view model
        var vm = {};
        $scope.vm = vm;

        //加载患者summary数据
        applicationService.blockUI();
        patientService.getPatientSummary(patientId)
            .then(function (data) {
                console.log('PatientSummaryController.data' + ',' + $location.$$path);
                vm.patient = data;
                tabService.addTab('charts.patients', 'charts/patients/{patientId}/profile', '个人信息', { stateName: 'charts.patients.profile', stateParams: { patientId: patientId } }, false);
                tabService.openTab('charts.patients', 'charts/patients/{patientId}/summary', '医疗小结', { stateName: 'charts.patients.summary', stateParams: { patientId: patientId } }, false);
                tabService.addTab('charts.patients', 'charts/patients/{patientId}/timeline', '就诊记录', { stateName: 'charts.patients.timeline', stateParams: { patientId: patientId } }, false);
            })
            .finally(function () {
                //加载插件(for select2)
                //pluginsService.init();
                applicationService.unblockUI();
            });

        $scope.savePatient = function () {
            $patientService.savePatient($scope.patient);
        }

    }
]);
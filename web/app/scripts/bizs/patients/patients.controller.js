angular.module('chApp.patients.controllers').controller('PatientsController', [
    '$scope','$rootScope', '$q', '$state', '$stateParams', '$location', 'pluginsService', 'tabService', 'patientService', 'applicationService',
    function ($scope, $rootScope, $q, $state, $stateParams, $location, pluginsService, tabService, patientService, applicationService) {
        //加载tab页
        //tabService.openTab('charts', $state.current.name, $location.$$path, $stateParams, 'Patient lists', false);
        tabService.openTab('patients', $location.$$path, '患者列表', { stateName: $state.current.name, stateParams: $stateParams }, false);
        var element = tabService.getTabPanel();
        var oElements = {};
        $scope.dto = {};
        $scope.dto.patient = {};
        $scope.dto.patients = [];


        //ajax获取patient list
        function getPatients() {
            return patientService.getPatients()
              .then(function (data) {
                  $scope.dto.patients = data;
                  return data;
              });
        }

        var watchHandler = $rootScope.$watch("currentUser.practiceId", function (newValue, oldValue) {
            if (newValue) {
                var user = $rootScope.currentUser || {};
                oElements = patientService.initWidgets(element,
                    function (patient) {
                        if (patient){
                            $state.go("biz.patients.details", {id: patient.id});
                        } else {
                            $state.go("biz.patients.addpatient");
                        }
                    });
                //加载数据
                //applicationService.blockUI();
                $q.all([getPatients()]).finally(function () {
                    //applicationService.unblockUI();
                });
                watchHandler();
            }
        });
        $scope.$watch("dto.patients", function (newValue, oldValue) {
            if (newValue) {
            }
            patientService.reloadDatas(newValue);
        });

    }
]);
angular.module('chApp.patients.controllers').controller('PatientDetailsTimeLineController', [
    '$scope','$rootScope', '$q', '$state', '$stateParams', '$location', 'pluginsService', 'tabService', 'patientService', 'applicationService',
    function ($scope, $rootScope, $q, $state, $stateParams, $location, pluginsService, tabService, patientService, applicationService) {
        $scope.patientId = $stateParams.patientId;
    }
]);
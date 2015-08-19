angular.module('chApp.common.controllers').controller('MainController',
    ['$state', '$scope', '$timeout', 'appConfig', 'applicationService',
        function ($state, $scope, $timeout, appConfig, applicationService) {
    applicationService.init();

    $timeout(function () {
        
        
    }, 1000);
    
}]);
angular.module('chApp.common.controllers').controller('MainController',
    ['$state', '$scope', '$timeout', '$cookieStore', 'appConfig', 'applicationService',
        function ($state, $scope, $timeout, $cookieStore, appConfig, applicationService) {
    applicationService.init();

    $timeout(function () {
        
        
    }, 1000);
    
}]);
angular.module('chApp.authorize.controllers').controller('LogoutController', ['$scope', '$rootScope', '$state', '$stateParams', '$location', '$http', '$cookies', 'appConfig', 'tabService', 'accountService',
    function($scope, $rootScope, $state, $stateParams, $location, $http, $cookies, appConfig, tabService, accountService) {
        $http.defaults.headers.common[appConfig.CH_AU_T_NAME] = null;
        $cookies[appConfig.CH_AU_T_NAME]='';
        $rootScope.currentUser = null;

        $state.go("authorize.login", null, { location: true });
    }
]);
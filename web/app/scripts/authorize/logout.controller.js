angular.module('chApp.authorize.controllers').controller('LogoutController', ['$scope', '$rootScope', '$state', '$stateParams', '$location', '$http', '$cookies', 'appConfig', 'tabService', 'accountService',
    function($scope, $rootScope, $state, $stateParams, $location, $http, $cookies, appConfig, tabService, accountService) {

        var tocken = $cookies[appConfig.CH_AU_T_NAME];
        if (tocken && $rootScope.currentUser) {
            var name = $rootScope.currentUser.name;
            accountService.logoutUser(name, tocken)
                .success(function(data, status) {
                    $http.defaults.headers.common[appConfig.CH_AU_T_NAME] = null;
                    $cookies[appConfig.CH_AU_T_NAME]='';
                    $rootScope.currentUser = null;
                    $rootScope.isLogin = true;
                    $state.go("authorize.login", null, { location: true });
                })
                .error(function(data, status) {
                    console.log(arguments);
                });
        } else {
            $http.defaults.headers.common[appConfig.CH_AU_T_NAME] = null;
            $cookies[appConfig.CH_AU_T_NAME]='';
            $rootScope.currentUser = null;
            $rootScope.isLogin = true;

            $state.go("authorize.login", null, { location: true });
        }

    }
]);
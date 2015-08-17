angular.module('chApp.authorize.controllers').controller('LockscreenController', ['$scope', '$rootScope', '$state', '$stateParams', '$location', '$http', '$cookies', 'appConfig', 'tabService', 'accountService',
    function ($scope, $rootScope, $state, $stateParams, $location, $http, $cookies, appConfig, tabService, accountService) {
        var user = $rootScope.currentUser;

        if (user == null) {
            $state.go("authorize.login", null, { location: true });
            return;
        }

        $rootScope.isLogin = true;
        $rootScope.isLoockscreen = true;

        $scope.fullName = user.familyName + user.givenName;
        $scope.name = user.name;
        $scope.password = null;

        $scope.loginUser = function (name, password) {
            accountService.loginUser(name, password)
                .success(function (data, status) {
                    _onUserLogin(data);
                })
                .error(function (data, status) {
                    console.log(arguments);
                });
        }

        function _onUserLogin(data) {
            accountService.whenUserLogined(data);
            $rootScope.isLogin = false;
            $rootScope.isLoockscreen = false;
        }
    }
]);
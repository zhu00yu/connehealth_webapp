'use strict';

angular.module('chApp.authorize.controllers').controller('LoginController', ['$scope', '$rootScope', '$state', '$stateParams', '$location', '$http', '$cookies', 'appConfig', 'tabService', 'accountService',
    function ($scope, $rootScope, $state, $stateParams, $location, $http, $cookies, appConfig, tabService, accountService) {
        $http.defaults.headers.common[appConfig.CH_AU_T_NAME] = null;
        $cookies[appConfig.CH_AU_T_NAME] = '';

        $rootScope.currentUser = null;
        $rootScope.isLogin = true;

        $scope.name = null;
        $scope.password = null;
        $scope.practices = [];

        accountService.getPractices().success(function(result){
            $scope.practices = result;
        });

        $scope.loginUser = function () {
            accountService.loginUser($scope.name, $scope.password, $scope.practiceId)
                .success(function (data, status) {
                    _onUserLogin(data);
                })
                .error(function (data, status) {
                    console.log(arguments);
                });
        }

        $scope.forgotPasswordForm = function ($event) {
            //console.log(arguments);
            $event.preventDefault();
            var formSignin = $($event.currentTarget).closest('.form-signin');
            var formPassword = formSignin.parent().find('.form-password');
            formSignin.slideUp(300, function () {
                formPassword.slideDown(300);
            });
        }

        $scope.loginForm = function ($event) {
            //console.log(arguments);
            $event.preventDefault();
            var formPassword = $($event.currentTarget).closest('.form-password');
            var formSignin = formPassword.parent().find('.form-signin');
            formPassword.slideUp(300, function () {
                formSignin.slideDown(300);
            });
        }

        function _onUserLogin(data) {
            accountService.whenUserLogined(data);
        }
    }
]);
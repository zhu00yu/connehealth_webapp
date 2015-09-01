'use strict';
angular.module('chApp.authorize.controllers').controller('RegisterController', ['$scope', '$rootScope', '$state', '$stateParams', '$location', 'appConfig', 'accountService',
    function ($scope, $rootScope, $state, $stateParams, $location, appConfig, accountService) {
        $rootScope.currentUser = null;

        $scope.practices = [];
        $scope.userDto = {};

        accountService.getPractices().success(function(result){
            $scope.practices = result;
        });

        $scope.registerUser = function() {
            var dto = $scope.userDto;
            accountService.registerUser(dto)
                .success(function(data, status) {
                    _onUserLogin(data);
                })
                .error(function(data, status) {
                    console.log(arguments);
                });
        };


        function _onUserLogin(data) {
            accountService.whenUserLogined(data);
        }
    }
]);
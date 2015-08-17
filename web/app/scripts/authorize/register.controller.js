angular.module('chApp.authorize.controllers').controller('RegisterController', ['$scope', '$rootScope', '$state', '$stateParams', '$location', 'appConfig', 'accountService',
    function ($scope, $rootScope, $state, $stateParams, $location, appConfig, accountService) {
        $rootScope.currentUser = null;
        $rootScope.isLogin = true;
        $scope.isForPatient = $stateParams.type === 'patient';
        $scope.isForProvider = $stateParams.type === 'provider';
        $scope.isForPractice = $stateParams.type === 'practice';

        $scope.userDto = accountService.getNewUser({ IsProvider: $scope.isForProvider, IsPractice: $scope.isForPractice });

        $scope.registerUser = function(userDto) {
            //console.log(userDto);
            accountService.registerUser(userDto)
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
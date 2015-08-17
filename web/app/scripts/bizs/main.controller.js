angular.module('chApp.biz.controllers').controller('BizMainController', [
    '$scope', '$rootScope', '$state', '$stateParams', '$location', '$http', '$cookies', 'appConfig', 'applicationService',
    function ($scope, $rootScope, $state, $stateParams, $location, $http, $cookies, appConfig, applicationService) {
        var user = $rootScope.currentUser;
        $scope.sideBarItems = [];
        $scope.topMenuItems = [];

        $scope.sideBarItems.push({
            state: "biz.practice",
            text: "机构管理",
            icon: "icon-bulb",
            subItems: [
                {
                    state: "biz.practice.basicinfo",
                    text: "机构信息"
                },
                {
                    state: "biz.practice.groups",
                    text: "科室管理"
                },
                {
                    state: "biz.practice.rooms",
                    text: "诊室管理"
                },
                {
                    state: "biz.practice.employees",
                    text: "员工管理"
                }
            ]
        });

        applicationService.init();
    }
]);
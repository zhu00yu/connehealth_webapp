'use strict';
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
        $scope.sideBarItems.push({
            state: "biz.charts",
            text: "病历管理",
            icon: "icon-bulb",
            subItems: [
                {
                    state: "biz.charts.list",
                    text: "病历列表"
                }
            ]
        });
        $scope.sideBarItems.push({
            state: "biz.patients",
            text: "患者管理",
            icon: "icon-bulb",
            subItems: [
                {
                    state: "biz.patients.list",
                    text: "患者列表"
                },
                {
                    state: "biz.patients.addpatient",
                    text: "添加患者"
                }
            ]
        });

        var allItems = [];
        _.each($scope.sideBarItems, function(item){
            if (!item.subItems){
                allItems.push({state:item.state, parent:null});
            }else{
                _.each(item.subItems, function(sub){
                    allItems.push({state:sub.state, parent:item.state});
                });
            }
        });


        $scope.isActive = function (viewLocation) {
            var item = _.find(allItems, function(item){ return item.state ==  $state.current.name });

            return viewLocation === $state.current.name || (item && viewLocation == item.parent);
        };
        applicationService.init();
    }
]);
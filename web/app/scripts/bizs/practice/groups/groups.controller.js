angular.module('chApp.practice.controllers').controller('PracticeGroupsController', 
    ['$scope', '$rootScope', '$state', '$stateParams', '$location', '$timeout', 'tabService', 'groupsService',
    function ($scope, $rootScope, $state, $stateParams, $location, $timeout, tabService, groupsService) {
        //加载tab页
        tabService.openTab('practice', $location.$$path, '科室管理', { stateName: $state.current.name, stateParams: $stateParams }, true);
        var element = tabService.getTabPanel();

        var oElements = {};
        $scope.groupDto = {};
        $scope.groupDto.group = {};
        $scope.groupDto.groups = [];

        function getGroups() {
            var user = $rootScope.currentUser || {};
            groupsService.getGroups(user.practiceId).then(function(result) {
                $scope.groupDto.groups = result.data;
            }, function(result) {
                console.log(arguments);
            });
        }

        var watchHandler = $rootScope.$watch("currentUser.practiceId", function (newValue, oldValue) {
            if (newValue) {
                oElements = groupsService.initWidgets(element,
                    oElements.DomTable, oElements.DomInsertModal, oElements.DomEditModal,
                    function(group) {
                        $scope.groupDto.group = group;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });
                getGroups();
                watchHandler();
            }
        });

        $scope.submitGroupEditor = function (isNew, group) {
            var user = $rootScope.currentUser || {};
            if (isNew) {
                groupsService.insertGroup(user.practiceId, group).then(function(result) {
                    getGroups();
                    groupsService.closeModals();
                }, function(result) {
                    console.log(arguments);
                });
            } else {
                groupsService.updateGroup(user.practiceId, group).then(function (result) {
                    getGroups();
                    groupsService.closeModals();
                }, function (result) {
                    console.log(arguments);
                });
            }
        };

        $scope.$watch("groupDto.groups", function (newValue, oldValue) {
            if (newValue) {
            }
            groupsService.reloadDatas(newValue);
        });
    }
]);
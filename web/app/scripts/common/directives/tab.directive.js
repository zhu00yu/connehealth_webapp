'use strict';

angular.module('chApp.common.directives').directive('tabDirective', [function () {
    return {
        restrict: 'A',
        scope: {
            groupname: '@'
        },
        controller: ['$scope', '$location', '$state', '$stateParams', 'tabService', function ($scope, $location, $state, $stateParams, tabService) {
            $scope.tabs = tabService.getTabs($scope.groupname);
            $scope.isSelected = function (tabId) {
                return tabService.isSelected($scope.groupname, tabId);
            }
            $scope.select = function (tabId) {
                var selectedTab = tabService.getSelectedTab($scope.groupname, tabId);
                var tab = tabService.getTab($scope.groupname, tabId);
                if (tab.tabId != selectedTab.tabId) {
                    $state.go(tab.state.stateName, tab.state.stateParams);
                }
            };
            $scope.closeTab = function ($event, tabId) {
                $event.stopPropagation();
                $event.preventDefault();
                tabService.closeTab($scope.groupname, tabId);
            }
        }],
        template: '<tabset class="nav-tabs3"><tab ng-repeat="tab in tabs" active="tab.isSelected" select="select(tab.tabId)"><tab-heading>{{tab.tabName}}<a style="margin-left:5px; href="#" ng-show="tab.canClose" ng-click="closeTab($event, tab.tabId)"><i class="icon-close"></i></a></tab-heading></tab></tabset>'
    };
}]);
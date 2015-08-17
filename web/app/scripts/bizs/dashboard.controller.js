angular.module('chApp.biz.controllers').controller('DashboardController', ['$scope', '$rootScope', '$state', '$stateParams', '$location', 'tabService', 'practiceService',
    function ($scope, $rootScope, $state, $stateParams, $location, tabService) {
        //加载tab页
        //tabService.openTab('charts', $state.current.name, $location.$$path, $stateParams, 'Patient lists', false);
        tabService.openTab('biz', $location.$$path, '首页', { stateName: $state.current.name, stateParams: $stateParams }, true);
    }
]);
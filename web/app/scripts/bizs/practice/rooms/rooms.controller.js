'use strict';
angular.module('chApp.practice.controllers').controller('PracticeRoomsController', ['$scope', '$rootScope', '$state', '$stateParams', '$location', 'tabService', 'practiceService',
    function ($scope, $rootScope, $state, $stateParams, $location, tabService, practiceService) {
        //加载tab页
        //tabService.openTab('charts', $state.current.name, $location.$$path, $stateParams, 'Patient lists', false);
        tabService.openTab('practice', $location.$$path, '诊室管理', { stateName: $state.current.name, stateParams: $stateParams }, true);
    }
]);
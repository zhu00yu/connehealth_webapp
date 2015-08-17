'use strict';

angular.module('chApp.practice.directives').directive('practiceGroupsDirective', [
    '$timeout', 'groupsService',
    function ($timeout, groupsService) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                var oElements = {};
                
                $timeout(function() {
                    oElements = groupsService.initWidgets(element,
                        oElements.DomTable, oElements.DomInsertModal, oElements.DomEditModal);
                }, 800);
            }
        };
    }]);
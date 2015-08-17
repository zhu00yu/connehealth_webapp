'use strict';

angular.module('chApp.common.directives').directive('backstretchDirective', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ctrl) {
            setTimeout(function () {
                $(element).backstretch(["/theme/global/images/gallery/login.jpg"],
                {
                    fade: 600,
                    duration: 4000
                });
            }, 200);
        }
    };
}]);
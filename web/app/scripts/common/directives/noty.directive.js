'use strict';

//弹出的通知框
angular.module('chApp.common.directives').directive('notyDirective', [function () {
    return {
        restrict: 'EA',
        scope: {
            source: '@',
            container: '@',
            text: '@'
        },
        controller: ['$scope', function ($scope) {
            $scope.$on("noty",
                function (event, msg) {
                    if (!msg || msg.source != $scope.source || !msg.show || !$scope.container) return;
                    var content = '<div class="alert alert-' + msg.type + ' media fade-in"><p>' + (msg.text || $scope.text) + '</p></div>';
                    $($scope.container).noty({
                        text: content,
                        dismissQueue: true,
                        layout: 'center',
                        closeWith: ['click'],
                        theme: 'made',
                        maxVisible: 10,
                        buttons: '',
                        animation: {
                            open: 'animated fadeIn',
                            close: 'animated fadeOut'
                        },
                        timeout: $scope.method || 3000,
                        callback: {
                            onShow: function () {
                                $('.noty_inline_layout_container').css('top', $($scope.container).position().top);
                                $('.noty_inline_layout_container').css('left', $($scope.container).position().left);
                                $('.noty_inline_layout_container').width($($scope.container).width());
                            }
                        }
                    });
                });
            }]
        };
}]);
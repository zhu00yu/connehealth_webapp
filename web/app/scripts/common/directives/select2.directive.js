'use strict';

angular.module('chApp.common.directives').directive('select2Directive', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        scope: {
            initValue: '@',
            refreshOptions: '=',
            placeholder: '@'
        },
        link: function(scope, element, attrs, ctrl) {
            function renderSelector(elem, initValue) {
                function format(state) {
                    var state_id = state.id;
                    if (!state_id) return state.text; // optgroup
                    return state.text;
                }

                var placeholder = $(elem).data('placeholder') || $(elem).prop('placeholder') || '';
                $(elem).select2("destroy");
                var selector = $(elem).select2({
                    formatResult: format,
                    formatSelection: format,
                    placeholder: placeholder,
                    allowClear: true,
                    //minimumInputLength: $(elem).data('minimumInputLength') ? $(elem).data('minimumInputLength') : -1,
                    minimumResultsForSearch: $(elem).data('search') ? 1 : -1,
                    dropdownCssClass: $(elem).data('style') ? 'form-white' : '',
                });

                selector && selector.select2("val", initValue);
            }

            var selector = element;
            var initValue = scope.initValue;
            if (!initValue) {
                initValue = $("option:eq(0)", element).val();
            }

            scope.$watch("initValue", function (newValue, oldValue) {
                initValue = newValue;
                //console.log(["initValue", newValue, oldValue]);
                $timeout(function () {
                    renderSelector(selector, initValue);
                }, 800);
            });
        }
    };
}]);
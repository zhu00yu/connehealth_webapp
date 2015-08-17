'use strict';

angular.module('chApp.common.directives').directive('citylistDirective', ['$compile', '$timeout', function ($compile, $timeout) {
    var template = '<select ng-model="location" class="form-control form-white" multiple="multiple" placeholder="{{placeholder}}"><option></option><option ng-repeat="city in cities" value="{{city[0]}}">{{city[1]}}</option></select>';
    return {
        restrict: 'A',
        replace: true,
        scope: {
            location: '=',
            placeholder: '@'
        },
        controller: ['$scope', '$location', '$state', 'locationsService', function ($scope, $location, $state, locationsService) {

            $scope.cities = [];
            // Catch data
            locationsService.loadLocations();

            var wa = $scope.$watch('location', function (newValue, oldValue) {
                if (newValue && typeof newValue === "string") {
                    $scope.location = newValue.split('|');
                }
                locationsService.loadLocations(function (provinces, locations) {
                    var datas = _.map(locations, function (r, key) {
                        return [r.region_id, r.fullname, r.zip_number, r.code];
                    });
                    $scope.cities = datas;
                    wa();
                });
            });

        }],
        template: template,
        compile: function (element, attrs, transclude) {
            function format(state) {
                var state_id = state.id;
                if (!state_id) return state.text; // optgroup
                return state.text;
            }
            function makeOptionsData(datas) {
                var data = { results: [] };
                var options = datas;
                for (var i = 0; options && i < options.length; i++) {
                    data.results.push({ id: options[i][0], text: options[i][1] });
                }
                return data;
            }
            function renderSelector(elem, options, value) {
                $(elem).select2("destroy");
                var settings = {
                    formatResult: format,
                    formatSelection: format,
                    minimumResultsForSearch: true,
                    dropdownCssClass: 'form-white',
                    allowClear: true,
                };
                if ($(elem).is('select')) {
                } else {
                    settings.data = options;
                }
                $(elem).select2(settings);
                value && $(elem).select2("val", value);
            }


            return function (scope, element, attrs) {
                var tmpl = template;
                element.html(tmpl);//.show();
                $compile(element.contents())(scope);

                scope.$watch('cities', function (newValue, oldValue) {
                    $timeout(function () {
                        var data = makeOptionsData(newValue);
                        renderSelector($(element), data, scope.location);
                    }, 800);
                });
            };
        },
        link: function (scope, element, attrs, ctrl) {
        }
    };
}]);
'use strict';

angular.module('chApp.common.directives').directive('citylistDirective', ['$compile', '$timeout', function ($compile, $timeout) {
//    var template = '<select ng-model="location" class="form-control form-white" multiple="multiple" placeholder="{{placeholder}}"><option></option><option ng-repeat="city in cities" value="{{city[0]}}">{{city[1]}}</option></select>';
    var template = '<select ng-model="location" class="form-control form-white" multiple="multiple" placeholder="{{placeholder}}"><option></option></select>';
    function format(state) {
        var state_id = state.id;
        if (!state_id) return state.text; // optgroup
        return state.text;
    }
    function renderSelector(elem, value) {
        $(elem).select2("destroy");
        var settings = {
            formatResult: format,
            formatSelection: format,
            minimumResultsForSearch: true,
            dropdownCssClass: 'form-white',
            allowClear: true,
        };
        $(elem).select2(settings);
        value && $(elem).select2("val", value);
    }
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
            });

            $scope.loadCities = function(){
                locationsService.loadLocations(function (provinces, locations) {
                    var data = _.map(locations, function (r, key) {
                        return [r.region_id, r.fullname, r.zip_number, r.code];
                    });
                    $scope.cities = data;
                });
            };

        }],
        template: template,
/*
        compile: function (element, attrs, transclude) {


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
*/
        link: function (scope, element, attrs, ctrl) {
            scope.$watch('cities', function (newValue, oldValue) {
                console.log(new Date()+newValue.length);
                if (newValue && newValue.length){

//                    $(element).empty();
//                    $(element).append("<option></option>");
                    _.each(scope.cities, function(c){
                        $(element).append("<option value="+c[0]+">"+c[1]+"</option>");
                    });

                    $(element).select2("val", scope.location);
                }
            });
            $timeout(function () {
                renderSelector($(element), scope.location);
                scope.loadCities();
            }, 800);
        }
    };
}]);
'use strict';

angular.module('chApp.common.directives').directive('locationDirective', ['$compile', '$timeout', function ($compile, $timeout) {
    var templateForTwoLineLayout = '<div class="row"><div class="col-sm-12">' +
                '<select id="provinceId" ng-model="provinceId" placeholder="省" class="form-control form-white"><option></option><option ng-repeat="province in provinces" value="{{province[0]}}">{{province[1]}}</option></select>' +
                '</div></div> <div class="row"><div class="col-sm-6">' +
                '<select id="cityId" ng-model="cityId" placeholder="市" class="form-control form-white"><option></option><option ng-repeat="city in cities" value="{{city[0]}}">{{city[1]}}</option></select>' +
                '</div> <div class="col-sm-6">' +
                '<select  id="regionId" ng-model="regionId" placeholder="区" class="form-control form-white"><option></option><option ng-repeat="region in regions" value="{{region[0]}}">{{region[1]}}</option></select>' +
                '</div></div>';
    var templateForOneLineLayout = '<div class="row"><div class="col-sm-4">' +
                '<select id="provinceId" ng-model="provinceId" placeholder="省" class="form-control form-white"><option></option><option ng-repeat="province in provinces" value="{{province[0]}}">{{province[1]}}</option></select>' +
                '</div> <div class="col-sm-4">' +
                '<select id="cityId" ng-model="cityId" placeholder="市" class="form-control form-white"><option></option><option ng-repeat="city in cities" value="{{city[0]}}">{{city[1]}}</option></select>' +
                '</div> <div class="col-sm-4">' +
                '<select  id="regionId" ng-model="regionId" placeholder="区" class="form-control form-white"><option></option><option ng-repeat="region in regions" value="{{region[0]}}">{{region[1]}}</option></select>' +
                '</div></div>';
    return {
        restrict: 'A',
        //terminal: true,
        scope: {
            provinceId: '=',
            cityId: '=',
            regionId: '=',
            layout: '@'
        },
        controller: ['$scope', '$location', '$state', 'locationsService', function($scope, $location, $state, locationsService) {
                //$scope.regions = null;
                //$scope.cities = null;
                //$scope.provinces = [];
                $scope.isThreeLineLayout = $scope.layout == 3;
                $scope.isTwoLineLayout = $scope.layout == 2;
                $scope.isOneLineLayout = $scope.layout == 1;



                $scope.changeProvince = function(id) {
                    locationsService.getCities(id, function(datas) {
                        $scope.cities = datas;
                        $scope.regions = null;
                    });
                };
                $scope.changeCity = function(id) {
                    locationsService.getRegions(id, function(datas) {
                        $scope.regions = datas;
                    });
                };
                $scope.changeRegion = function(id) {

                };
                this.getService = function () { return locationsService };


                $scope.$watch('provinceId', function (newValue, oldValue) {
                    locationsService.getProvinces(function(datas) {
                        $scope.provinces = datas;
                        $scope.changeProvince(newValue);
                    });
                });
                $scope.$watch('cityId', function(newValue, oldValue) {
                    $scope.changeCity(newValue);
                });
            }
        ],
        template: templateForTwoLineLayout,
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

            return function(scope, element, attrs) {
                var tmpl = scope.isOneLineLayout ? templateForOneLineLayout : templateForTwoLineLayout;
                element.html(tmpl); //.show();
                $compile(element.contents())(scope);

                scope.$watch('provinces', function (newValue, oldValue) {
                    $timeout(function() {
                        var data = makeOptionsData(newValue);
                        renderSelector($('#provinceId', element), data, scope.provinceId);
                    }, 800);
                });

                scope.$watch('cities', function(newValue, oldValue) {
                    $timeout(function () {
                        var data = makeOptionsData(newValue);
                        renderSelector($('#cityId', element), data, scope.cityId);
                    }, 800);
                });

                scope.$watch('regions', function(newValue, oldValue) {
                    $timeout(function() {
                        var data = makeOptionsData(newValue);
                        renderSelector($('#regionId', element), data, scope.regionId);
                    }, 800);
                });
            };
        }
    };
}]);
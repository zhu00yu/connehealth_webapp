'use strict';

angular.module('chApp.common.services').factory('locationsService', ["$http", "$rootScope", "appConfig", function ($http, $rootScope, appConfig) {
    var service = {};

    var _locations = [];
    var _provinces = {};
    var _cities = {};
    var _regions = {};

    function _loadLocations(callback) {
        if (_locations.length === 0) {
            $http.get("/data/locations.json.html").success(function (data) {
                _locations = data["RECORDS"];

                _.each(_locations, function(loc) {
                    var province = _provinces[loc.province_id] || {cities: {} };
                    province.name = loc.province_name;

                    var city = province.cities[loc.city_id] || { regions: {} };
                    city.name = loc.city_name;
                    city.province = province;

                    var region = city.regions[loc.region_id] || {};
                    region.name = loc.region_name;
                    region.zip = loc.zip_number;
                    region.code = loc.code;
                    region.city = city;

                    city.regions[loc.region_id] = region;

                    province.cities[loc.city_id] = city;

                    _provinces[loc.province_id] = province;
                });

                if(typeof callback === "function") {
                    callback(_provinces, _locations);
                }
            });
        } else if(typeof callback === "function") {
            callback(_provinces, _locations);
        }
    }

    function _getProvinces(callback) {
        _loadLocations(function(provinces, locations) {
            var datas = _.map(provinces, function(p, key) {
                return [key, p.name];
            });
            if (typeof callback === "function") {
                callback(datas);
            }
        });
    }

    function _getCities(provinceId, callback) {
        if (provinceId) {
            _loadLocations(function (provinces, locations) {
                var cities = provinces[provinceId].cities;
                var datas = _.map(cities, function (c, key) {
                    return [key, c.name];

                });
                if (typeof callback === "function") {
                    callback(datas);
                }
            });
        }
    }

    function _getRegions(cityId, callback) {
        if (cityId) {
            _loadLocations(function(provinces, locations) {
                var regions = _.filter(locations, function(r) { return r.city_id == cityId });
                var datas = _.map(regions, function(r, key) {
                    return [r.region_id, r.region_name, r.zip_number, r.code];

                });
                if (typeof callback === "function") {
                    callback(datas);
                }
            });
        }
    }

    service.getProvinces = _getProvinces;
    service.getCities = _getCities;
    service.getRegions = _getRegions;

    service.loadLocations = _loadLocations;
    
    return service;
}]);
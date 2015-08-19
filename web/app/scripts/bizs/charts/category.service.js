'use strict';

angular.module('chApp.charts.services').factory('categoryService', ['$http', function ($http) {
    var service = {};

    //获取全部category
    service.getCategories = function () {
        return $http.get(ch.settings.API_SERVER + '/api/categories/list')
                    .then(getCategoriesComplete)
                    .catch(getCategoriesFailed);

        function getCategoriesComplete(response) {
            return response.data;
        }
        function getCategoriesFailed(error) {
            alert('XHR Failed for getCategories.' + error.data);
        }
    };

    service.filterCategories = function(bigCategory, allCategories){
        var categories = [];
        for (var i in allCategories) {
            if (allCategories[i].BigCategory == bigCategory) categories.push(allCategories[i]);
        }
        return categories;
    };

    return service;
}]);
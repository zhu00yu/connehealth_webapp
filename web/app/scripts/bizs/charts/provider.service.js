'use strict';

angular.module('chApp.charts.services').factory('providerService', ['$http', function ($http) {
    var service = {};

    //var _providers = [{
    //    ProviderId: 'all',
    //    ProviderName: '全部医生'
    //}, {
    //    ProviderId: '2adc1561-6e0c-48a0-ab29-ad7ed4bde881',
    //    ProviderName: '张医生'
    //}, {
    //    ProviderId: '2adc1561-6e0c-48a0-ab29-ad7ed4bde882',
    //    ProviderName: '朱医生'
    //}, {
    //    ProviderId: '2adc1561-6e0c-48a0-ab29-ad7ed4bde883',
    //    ProviderName: '宫医生'
    //}, {
    //    ProviderId: '2adc1561-6e0c-48a0-ab29-ad7ed4bde884',
    //    ProviderName: '高医生'
    //}];

    //获取全部provider
    service.getProviders = function () {
        return $http.get(ch.settings.API_SERVER + '/api/providers/list')
                    .then(getProvidersComplete)
                    .catch(getProvidersFailed);

        function getProvidersComplete(response) {
            return response.data;
        }
        function getProvidersFailed(error) {
            alert('XHR Failed for getProviders.' + error.data);
        }
    };

    return service;
}]);
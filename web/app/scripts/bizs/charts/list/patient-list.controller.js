angular.module('chApp.charts.controllers').controller('PatientListController', ['$scope', '$q', '$state', '$stateParams', '$location', 'pluginsService', 'tabService', 'patientService', 'providerService', 'applicationService',
    function ($scope, $q, $state, $stateParams, $location, pluginsService, tabService, patientService, providerService, applicationService) {
        //加载tab页
        //tabService.openTab('charts', $state.current.name, $location.$$path, $stateParams, 'Patient lists', false);
        tabService.openTab('charts', 'charts/list', '患者列表', { stateName: 'charts.list', stateParams: $stateParams }, false);
        console.log('PatientListController');
        //从url中获取页面参数
        $scope.providerId = $stateParams.providerId;
        $scope.scheduledDate = $stateParams.scheduledDate;

        //患者列表数据
        var searchCondition = {
            providerId: $scope.providerId,
            scheduledDate: $scope.scheduledDate
        };
        //加载数据
        $q.all([getProviders(), getPatients(searchCondition)]).finally(function () {
            applicationService.unblockUI();
        });

        //change provider时切换url和state
        $scope.changeProvider = function () {
            $state.go('charts.list', {
                providerId: $scope.providerId,
                scheduledDate: $scope.scheduledDate
            });
        };

        //默认的scheduledDate
        $scope.scheduledDateRecent = 'recent';
        $scope.scheduledDateDate = $scope.scheduledDate == 'recent'? new Date(): Date($scope.scheduledDate);

        //change scheduled选项时切换url和state
        $scope.changeScheduled = function (isScheduled) {
            if ((isScheduled && $scope.scheduledDate != 'recent') || (!isScheduled && $scope.scheduledDate == 'recent')) return;
            $scope.scheduledDate = isScheduled? new Date().format('yyyy-MM-dd'): 'recent';
            $state.go('charts.list', {
                providerId: $scope.providerId,
                scheduledDate: $scope.scheduledDate
            });
        };

        //ajax获取patient list
        function getPatients(searchCondition) {
            applicationService.blockUI();
            return patientService.getPatients(searchCondition)
              .then(function (data) {
                  $scope.patientDtos = data;
                  //总记录数
                  $scope.patientCount = ($scope.patientDtos||[]).length;
                  return $scope.patientDtos;
              });
        }
        //ajax获取provider list
        function getProviders() {
            applicationService.blockUI();
            return providerService.getProviders()
              .then(function (data) {
                  $scope.providers = data;
                  $scope.providers.unshift({
                      'ProviderId': 'all',
                      'ProviderName': '全部医生'
                  });
                  return $scope.providers;
              }).finally(function () {
                  //加载插件(for select2)
                  pluginsService.init();
              });
        }
    }
]);
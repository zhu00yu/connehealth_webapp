angular.module('chApp.practice.controllers').controller('PracticeEmployeesController',
    ['$scope', '$rootScope', '$state', '$stateParams', '$location', 'tabService', 'employeesService',
    function ($scope, $rootScope, $state, $stateParams, $location, tabService, employeesService) {
        //加载tab页
        tabService.openTab('practice', $location.$$path, '员工管理', { stateName: $state.current.name, stateParams: $stateParams }, true);
        var element = tabService.getTabPanel();
        var oElements = {};
        $scope.dto = {};
        $scope.dto.employee = {};
        $scope.dto.employees = [];

        function getEmployees() {
            var user = $rootScope.currentUser || {};
            employeesService.getEmployees(user.practiceId).then(function (result) {
                $scope.dto.employees = result.data;
            }, function (result) {
                console.log(arguments);
            });
        }

        var watchHandler = $rootScope.$watch("currentUser.practiceId", function (newValue, oldValue) {
            if (newValue) {
                var user = $rootScope.currentUser || {};
                oElements = employeesService.initWidgets(user.practiceId, element,
                    oElements.DomTable, oElements.DomInsertModal, oElements.DomEditModal,
                    function (employee) {
                        if (employee.PracticeLocation && typeof employee.PracticeLocation == "string") {
                            employee.PracticeLocation = employee.PracticeLocation.split("|");
                        }
                        if (employee.Specialties && typeof employee.Specialties == "string") {
                            employee.Specialties = employee.Specialties.split("|");
                        }
                        $scope.dto.employee = employee;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });
                getEmployees();
                watchHandler();
            }
        });
        $scope.$watch("dto.employees", function (newValue, oldValue) {
            if (newValue) {
            }
            employeesService.reloadDatas(newValue);
        });

        $scope.submitEmployeeEditor = function(isNew, employee) {
            var user = $rootScope.currentUser || {};
            if (isNew) {
                employeesService.insertEmployee(user.practiceId, employee).then(function (result) {
                    getEmployees();
                    employeesService.closeModals();
                }, function (result) {
                    console.log(arguments);
                });
            } else {
                employeesService.updateEmployee(user.practiceId, employee).then(function (result) {
                    getEmployees();
                    employeesService.closeModals();
                }, function (result) {
                    console.log(arguments);
                });
            }
        }
    }
]);
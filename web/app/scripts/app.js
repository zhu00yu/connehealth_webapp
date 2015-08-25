'use strict';

angular.module('chApp.constants', []);
angular.module('chApp.services', []);
angular.module('chApp.controllers', []);
angular.module('chApp.directives', []);

angular.module('chApp.biz.controllers', []);
angular.module('chApp.common.directives', []);
angular.module('chApp.common.controllers', []);
angular.module('chApp.common.services', []);

angular.module('chApp.charts.services', []);
angular.module('chApp.charts.controllers', []);

angular.module('chApp.practice.directives', []);
angular.module('chApp.practice.services', []);
angular.module('chApp.practice.controllers', []);

angular.module('chApp.patients.directives', []);
angular.module('chApp.patients.services', []);
angular.module('chApp.patients.controllers', []);

angular.module('chApp.authorize.services', []);
angular.module('chApp.authorize.controllers', []);

angular
  .module('chApp', [
        'ngCookies', 'ui.router', 'ui.bootstrap',
        'chApp.constants', 'chApp.services', 'chApp.controllers', 'chApp.directives',
        'chApp.biz.controllers',
        'chApp.common.controllers', 'chApp.common.directives', 'chApp.common.services',
        'chApp.charts.controllers', 'chApp.charts.services',
        'chApp.practice.controllers', 'chApp.practice.services', 'chApp.practice.directives',
        'chApp.patients.controllers', 'chApp.patients.services', 'chApp.patients.directives',
        'chApp.authorize.controllers', 'chApp.authorize.services'
  ])
  .config(function ( $urlRouterProvider, $stateProvider, $httpProvider) {
        $httpProvider.defaults.withCredentials = true;
        //$httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = 'http://localhost:9000';
        $urlRouterProvider.when("", "/biz/dashboard");
        $stateProvider.state("authorize", {
            url: "/authorize",
            views: {
                'main': {
                    templateUrl: "/scripts/authorize/authorize.html"
                }
            }
        })
        .state("authorize.login", {
            url: "/login",
            templateUrl: "/scripts/authorize/login.html",
            controller: "LoginController"
        })
        .state("authorize.register", {
            url: "/login",
            templateUrl: "/scripts/authorize/register.html",
            controller: "RegisterController"
        })
        .state("authorize.lockscreen", {
            url: "/lockscreen",
            templateUrl: "/scripts/authorize/lockscreen.html",
            controller: "LockscreenController"
        })
        .state("authorize.logout", {
            url: "/logout",
            template: "",
            controller: "LogoutController"
        })
        .state("biz", {
            url: "/biz",
            views: {
                'main': {
                    templateUrl: "/scripts/bizs/main.html",
                    controller: "BizMainController"
                }
            }
        })
        .state("biz.dashboard", {
            url: "/dashboard",
            templateUrl: "/scripts/bizs/dashboard.html",
            controller: "DashboardController"
        })
        .state("biz.practice", {
            url: "/practice",
            templateUrl: "/scripts/bizs/practice/main.html"
        })
        .state("biz.practice.basicinfo", {
            url: "/basicinfo/:id",
            templateUrl: "/scripts/bizs/practice/basicinfo/basicinfo.html",
            controller: "PracticeBasicinfoController"
        })
        .state("biz.practice.employees", {
            url: "/employees/:id",
            templateUrl: "/scripts/bizs/practice/employees/employees.html",
            controller: "PracticeEmployeesController"
        })
        .state("biz.patients", {
            url: "/patients",
            templateUrl: "/scripts/bizs/patients/main.html"
        })
        .state("biz.patients.list", {
            url: "/patients/list",
            templateUrl: "/scripts/bizs/patients/patients.html",
            controller: "PatientsController"
        })
        .state("biz.patients.details", {
            url: "/patients/details/{patientId}",
            templateUrl: "/scripts/bizs/patients/details/details.html",
            controller: "PatientDetailsController"
        })
        .state("biz.patients.details.profile", {
            url: "/profile",
            templateUrl: "/scripts/bizs/patients/details/details_profile.html",
            controller: "PatientDetailsProfileController"
        })
        .state("biz.patients.details.summary", {
            url: "/summary",
            templateUrl: "/scripts/bizs/patients/details/details_summary.html",
            controller: "PatientDetailsSummaryController"
        })
        .state("biz.patients.details.timeline", {
            url: "/timeline",
            templateUrl: "/scripts/bizs/patients/details/details_timeline.html",
            controller: "PatientDetailsTimeLineController"
        })
        .state("biz.patients.addpatient", {
            url: "/patients/new",
            templateUrl: "/scripts/bizs/patients/new/new_patient.html",
            controller: "NewPatientController"
        })
  })
    .run([
        '$templateCache', '$rootScope', '$state', '$stateParams', '$location', '$cookies', '$http',
        'appConfig', 'accountService',
        function($templateCache, $rootScope, $state, $stateParams, $location, $cookies, $http,
                 appConfig, accountService) {


            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams) {
            });
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            });
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                var isFromAuthorizePage = 0 === fromState.name.indexOf('authorize');
                var isToAuthorizePage = 0 === toState.name.indexOf('authorize');
                switch (toState.name) {
                    case "authorize.login":
                    case "authorize.logout":
                    case "authorize.lockscreen":
                        if (!isFromAuthorizePage) {
                            $rootScope.previourState = fromState;
                            $rootScope.previourStateParams = fromParams;
                            $cookies.put(appConfig.CH_AU_T_NAME, '');
                        }
                        break;
                    default:
                        if (!isToAuthorizePage) {
                            $rootScope.previourState = fromState;
                            $rootScope.previourStateParams = fromParams;
                        }
                        break;
                }

                if (isToAuthorizePage){
                    return;
                }

                var token = $cookies.get(appConfig.CH_AU_T_NAME);
                if (token) {
                    accountService.checkTocken(token, "#")
                        .success(function(data, status) {
                            accountService.whenTokenValid(data);
                        })
                        .error(function(data, status) {
                            $rootScope.currentUser = null;
                            $state.go("authorize.login", null, { location: true });
                            event.preventDefault();
                        });
                } else {
                    $rootScope.currentUser = null;
                    $state.go("authorize.login", null, { location: true });
                    event.preventDefault();
                }
            });
            $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
            });

        }
    ]);


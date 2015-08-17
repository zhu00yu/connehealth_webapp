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
        'chApp.authorize.controllers', 'chApp.authorize.services'
  ])
  .config(function ( $urlRouterProvider, $stateProvider, $httpProvider) {
        $httpProvider.defaults.withCredentials = true;
        //$httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = 'http://localhost:9000';
        $urlRouterProvider.when("", "/biz/dashboard");
        $stateProvider.state("authorize", {
                url: "/authorize",
                templateUrl: "/scripts/authorize/authorize.html"
        })
        .state("authorize.login", {
            // 登录页面
            url: "/login",
            templateUrl: "/scripts/authorize/login.html",
            controller: "LoginController"
        })
        .state("biz", {
            // 登录页面
            url: "/biz",
            templateUrl: "/scripts/bizs/main.html",
            controller: "BizMainController"
        })
        .state("biz.dashboard", {
            // 登录页面
            url: "/dashboard",
            templateUrl: "/scripts/bizs/dashboard.html",
            controller: "DashboardController"
        })
        .state("biz.practice", {
            // 登录页面
            url: "/practice",
            templateUrl: "/scripts/bizs/practice/main.html"
        })
        .state("biz.practice.basicinfo", {
            // 登录页面
            url: "/basicinfo/:id",
            templateUrl: "/scripts/bizs/practice/basicinfo/basicinfo.html",
            controller: "PracticeBasicinfoController"
        })
  })
    .run([
        '$templateCache', '$rootScope', '$state', '$stateParams', '$location', '$cookies', '$http',
        'appConfig', 'accountService',
        function($templateCache, $rootScope, $state, $stateParams, $location, $cookies, $http,
                 appConfig, accountService) {

            var token = $cookies[appConfig.CH_AU_T_NAME];
            if (token) {
                accountService.checkTocken(token, "#")
                    .success(function(data, status) {
                        accountService.whenTockenValid(data);
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
                                        $cookies[appConfig.CH_AU_T_NAME] = '';
                                    }
                                    break;
                                default:
                                    if (!isToAuthorizePage) {
                                        $rootScope.previourState = fromState;
                                        $rootScope.previourStateParams = fromParams;
                                    }
                                    break;
                            }
                        });
                        $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
                        });
                    })
                    .error(function(data, status) {
                        $rootScope.currentUser = null;
                        $state.go("authorize.login", null, { location: true });
                    });
            } else {
                $rootScope.currentUser = null;
                $state.go("authorize.login", null, { location: true });
            }

        }
    ]);


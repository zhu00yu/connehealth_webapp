'use strict';

angular.module('chApp.common.directives').directive('panelBoxDirective', ['applicationService', 'pluginsService', function (applicationService, pluginsService) {
    
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        controller: ['$scope', '$location', '$state', function ($scope, $location, $state) {
            
        }],
        template: '<div class="panel" ng-transclude></div>',
        link: function (scope, element, attrs, ctrl) {
            $(".panel-header .panel-close", element).on("click", function (event) {
                event.preventDefault();
                var $item = $(this).parents(".panel:first");
                bootbox.confirm("Are you sure to remove this panel?", function (result) {
                    if (result === true) {
                        $item.addClass("animated bounceOutRight");
                        window.setTimeout(function () {
                            $item.remove();
                        }, 300);
                    }
                });
            });

            $(".panel-header .panel-toggle", element).on("click", function (event) {
                event.preventDefault();
                $(this).toggleClass("closed").parents(".panel:first").find(".panel-content").slideToggle();
            });

            // Popout / Popin Panel
            $(".panel-header .panel-popout", element).on("click", function (event) {
                event.preventDefault();
                var panel = $(this).parents(".panel:first");
                if (panel.hasClass("modal-panel")) {
                    $("i", this).removeClass("icons-office-55").addClass("icons-office-58");
                    panel.removeAttr("style").removeClass("modal-panel");
                    panel.find(".panel-maximize,.panel-toggle").removeClass("nevershow");
                    panel.draggable("destroy").resizable("destroy");
                } else {
                    panel.removeClass("maximized");
                    panel.find(".panel-maximize,.panel-toggle").addClass("nevershow");
                    $("i", this).removeClass("icons-office-58").addClass("icons-office-55");
                    var w = panel.width();
                    var h = panel.height();
                    panel.addClass("modal-panel").removeAttr("style").width(w).height(h);
                    $(panel).draggable({
                        handle: ".panel-header",
                        containment: ".page-content"
                    }).css({
                        "left": panel.position().left - 10,
                        "top": panel.position().top + 2
                    }).resizable({
                        minHeight: 150,
                        minWidth: 200
                    });
                }
                window.setTimeout(function () {
                    $("body").trigger("resize");
                }, 300);
            });
            // Reload Panel Content
            $('.panel-header .panel-reload', element).on("click", function (event) {
                event.preventDefault();
                var el = $(this).parents(".panel:first");
                blockUI(el);
                window.setTimeout(function () {
                    unblockUI(el);
                }, 1800);
            });
            // Maximize Panel Dimension 
            $(".panel-header .panel-maximize", element).on("click", function (event) {
                event.preventDefault();
                var panel = $(this).parents(".panel:first");
                $body.toggleClass("maximized-panel");
                panel.removeAttr("style").toggleClass("maximized");
                maximizePanel();
                if (panel.hasClass("maximized")) {
                    panel.parents(".portlets:first").sortable("destroy");
                    $(window).trigger('resize');
                }
                else {
                    $(window).trigger('resize');
                    panel.parent().height('');
                    pluginsService.sortablePortlets();
                }
                $("i", this).toggleClass("icon-size-fullscreen").toggleClass("icon-size-actual");
                panel.find(".panel-toggle").toggleClass("nevershow");
                $("body").trigger("resize");
                return false;
            });

            function maximizePanel() {
                if ($('.maximized').length) {
                    var panel = $('.maximized');
                    var windowHeight = $(window).height() - 2;
                    var panelHeight = panel.find('.panel-header').height() + panel.find('.panel-content').height() + 100;
                    if (panel.hasClass('maximized')) {
                        if (windowHeight > panelHeight) {
                            panel.parent().height(windowHeight);
                        }
                        else {
                            if ($('.main-content').height() > panelHeight) {
                                panel.parent().height($('.main-content').height());
                            }
                            else {
                                panel.parent().height(panelHeight);
                            }
                        }
                    }
                    else {
                        panel.parent().height('');
                    }
                }
            }

            function blockUI(item) {
                $(item).block({
                    message: '<svg class="circular"><circle class="path" cx="40" cy="40" r="10" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg>',
                    css: {
                        border: 'none',
                        width: '14px',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: '#fff',
                        opacity: 0.6,
                        cursor: 'wait'
                    }
                });
            }

            function unblockUI(item) {
                $(item).unblock();
            }

        }
    };
}]);

angular.module('chApp.common.directives').directive('panelBoxHeaderDirective', [function () {

    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        require: '^?panelBoxDirective',
        scope: {
            headerTitle: '@'
        },
        controller: ['$scope', '$location', '$state', function ($scope, $location, $state) {

        }],
        template: '<div class="panel-header panel-controls">\
                        <h3>\
                            <i class="icon-bulb"></i> <strong>{{headerTitle}}</strong>\
                        </h3>\
                        <div class="control-btn">\
                            <!--<a href="#" class="panel-reload hidden"><i class="icon-reload"></i></a>-->\
                            <!--<a href="#" class="panel-popout hidden tt" title="Pop Out/In"><i class="icons-office-58"></i></a>-->\
                            <a href="#" class="panel-maximize hidden"><i class="icon-size-fullscreen"></i></a>\
                            <a href="#" class="panel-toggle"><i class="fa fa-angle-down"></i></a>\
                            <!--<a href="#" class="panel-close"><i class="icon-trash"></i></a>-->\
                        </div>\
                        <div class="control-btn" ng-transclude></div>\
                    </div>',
        link: function (scope, element, attrs, ctrl) {
            
        }
    };
}]);

angular.module('chApp.common.directives').directive('panelBoxContentDirective', [function () {

    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        require: '^?panelBoxDirective',
        scope: {
            title: '='
        },
        controller: ['$scope', '$location', '$state', function ($scope, $location, $state) {

        }],
        template: '<div class="panel-content" ng-transclude></div>',
        link: function (scope, element, attrs, ctrl) {
            
        }
    };
}]);
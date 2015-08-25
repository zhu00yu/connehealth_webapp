'use strict';

angular.module('chApp.common.directives').directive('barcodeC128Directive', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        replace:true,
        scope: {
            codeValue: '@'
        },
        template: '<img alt="{{codeValue}}" style="border-radius: 0;vertical-align: top;" />',
        link: function(scope, element, attrs, ctrl) {
            scope.$watch("codeValue", function (newValue, oldValue) {
               if(newValue){
                   $(element).JsBarcode(newValue,{
                       width:  1,
                       height: 15,
                       quite: 10,
                       format: "CODE128",
                       displayValue: false,
                       font:"monospace",
                       textAlign:"center",
                       fontSize: 12,
                       backgroundColor:"",
                       lineColor:"#000"
                   });
               }
            });
        }
    };
}]);
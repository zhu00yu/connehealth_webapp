'use strict';

angular.module('chApp.common.directives').directive('fileInputDirective', [function () {
    
    return {
        restrict: 'A',
        //terminal: true,
        scope: {
            label: '@',
            fileid: '=',
            filename: '@',
            fileread: '=',
            filedata: '=',
            fileurl: '=',
            token: '='
        },
        controller: ['$scope', '$location', '$state', function ($scope, $location, $state) {
            $scope.fileurl = $scope.fileurl || "images/certificate.svg";
            $scope.removeFile = function(){
                $scope.fileid=null;
                $scope.filename=null;
                $scope.filedata=null;
                $scope.fileurl=null;
            };

//            $scope.$watch('token', function(newValue, oldValue){
//                if ($scope.fileurl.indexOf('?') == -1){
//                    $scope.fileurl += '?';
//                }
//                $scope.fileurl += 'token=' + newValue;
//            });
        }],
        template: '<div ng-hide="fileid!=null" class="fileinput fileinput-new input-group" data-provides="fileinput">\
                        <div class="form-control" data-trigger="fileinput">\
                            <i class="glyphicon glyphicon-file fileinput-exists"></i><span class="fileinput-filename"></span>\
                        </div>\
                        <span class="input-group-addon btn btn-default btn-file">\
                            <span class="fileinput-new">浏览...</span>\
                            <span class="fileinput-exists">修改</span>\
                            <input type="file" name="...">\
                        </span>\
                        <a class="input-group-addon btn btn-default fileinput-exists" data-dismiss="fileinput">删除</a>\
                    </div>\
                    <div ng-show="fileid!=null" class="input-group">\
                        <input type="text" class="form-control form-white readonly" ng-model="filename">\
                        <a href="{{fileurl}}" target="_blank" class="input-group-addon btn btn-default">查看</a>\
                        <a type="button" ng-click="removeFile()" class="input-group-addon btn btn-default">删除</a>\
                    </div>',
        link: function (scope, element, attrs, ctrl) {
            $(element).fileinput({showRemove:false, showCancel:true});
            $("input[type=file]", element).bind("change", function (changeEvent) {
                var reader = new FileReader();
                var fileread = changeEvent.target.files[0];
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.filedata = loadEvent.target.result;
                        scope.fileread = fileread;
                    });
                }
                reader.readAsDataURL(fileread);
            });
        }
    };
}]);
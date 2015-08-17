'use strict';

angular.module('chApp.common.directives').directive('imageFileInputDirective', [function () {
    
    return {
        restrict: 'A',
        //terminal: true,
        scope: {
            label: '@',
            fileid: '=',
            fileread: '=',
            filedata: '=',
            fileurl: '='
        },
        controller: ['$scope', '$location', '$state', function ($scope, $location, $state) {
            $scope.fileurl = $scope.fileurl || "images/certificate.svg";
        }],
        template: '<div class="fileinput fileinput-new" data-provides="fileinput"> \
                        <p style="margin:0"><strong>{{label}}</strong></p> \
                        <div class="fileinput-new thumbnail" style="width: auto; height: 150px;"> \
                            <img ng-src="{{fileurl}}" class="img-responsive" alt="图片"> \
                        </div> \
                        <div class="fileinput-preview fileinput-exists thumbnail" style="max-width: 200px; max-height: 150px;"></div> \
                        <div> \
                            <span class="btn btn-default btn-file"> \
                                <span class="fileinput-new">选择</span><span class="fileinput-exists">修改</span> \
                                <input type="file" name="..."> \
                            </span> \
                            <a href="#" class="btn btn-default fileinput-exists hide" data-dismiss="fileinput">删除</a> \
                        </div> \
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
'use strict';
angular.module('chApp.practice.controllers').controller('PracticeBasicinfoController',
    ['$scope', '$rootScope', '$state', '$stateParams', '$location', '$q', 'tabService', 'basicInfoService',
    function ($scope, $rootScope, $state, $stateParams, $location, $q, tabService, basicInfoService) {
        //加载tab页
        //tabService.openTab('charts', $state.current.name, $location.$$path, $stateParams, 'Patient lists', false);
        tabService.openTab('practice', $location.$$path, '机构信息', { stateName: $state.current.name, stateParams: $stateParams }, true);

        $scope.basicInfoDto = {};

        $scope.submitPracticeBasicInfo = function (data) {
            var practiceId = data.practiceInfo.id;
            var plFileId = data.practiceLicenseFileId;
            var plFileData = data.practiceLicenseFileData;
            var plFileName = data.practiceLicenseFileName || "PRACTICELICENSE_FILE.JPG";
            var blFileId = data.businessLicenseFileId;
            var blFileData = data.businessLicenseFileData;
            var blFileName = data.businessLicenseFileName || "BUSINESSLICENSE_FILE.JPG";
            var ocFileId = data.organizationCodeFileId;
            var ocFileData = data.organizationCodeFileData;
            var ocFileName = data.organizationCodeFileName || "ORGANIZATION_CODE_FILE.JPG";
            var taxFileId = data.taxEnrolFileId;
            var taxFileData = data.taxEnrolFileData;
            var taxFileName = data.taxEnrolFileName || "TAX_ENROL_FILE.JPG";

            var promises = [];
            if (plFileData) {
                var promise = basicInfoService.uploadPracticeFile(plFileId, plFileName, plFileData).then(function(result) {
                    data.practiceLicenseFileId = +result.data;
                    data.practiceInfo.practiceLicenseFileId = +result.data;
                }, function(result) {
                    console.log(arguments);
                });
                promises.push(promise);
            }
            if (blFileData) {
                var promise = basicInfoService.uploadPracticeFile(blFileId, blFileName, blFileData).then(function (result) {
                    data.businessLicenseFileId = +result.data;
                    data.practiceInfo.businessLicenseFileId = +result.data;
                }, function (result) {
                    console.log(arguments);
                });
                promises.push(promise);
            }
            if (ocFileData) {
                var promise = basicInfoService.uploadPracticeFile(ocFileId, ocFileName, ocFileData).then(function (result) {
                    data.organizationCodeFileId = +result.data;
                    data.practiceInfo.organizationCodeFileId = +result.data;
                }, function (result) {
                    console.log(arguments);
                });
                promises.push(promise);
            }
            if (taxFileData) {
                var promise = basicInfoService.uploadPracticeFile(taxFileId, taxFileName, taxFileData).then(function (result) {
                    data.taxEnrolFileId = +result.data;
                    data.practiceInfo.taxEnrolFileId = +result.data;
                }, function (result) {
                    console.log(arguments);
                });
                promises.push(promise);
            }
            $q.all(promises).then(function(){
                basicInfoService.updatePractice(practiceId, data.practiceInfo).then(function (result) {
                    result.data.provinceId = result.data.provinceId + "";
                    result.data.cityId = result.data.cityId + "";
                    result.data.districtId = result.data.districtId + "";

                    $scope.basicInfoDto.practiceInfo = result.data;

                }, function() {
                    console.log(arguments);
                });
            });

        };

        $scope.$on("$viewContentLoaded", function (event) {
            basicInfoService.getPracticeOfCurrentUser().then(function(result) {
                result.data.provinceId = result.data.provinceId + "";
                result.data.cityId = result.data.cityId + "";
                result.data.districtId = result.data.districtId + "";

                var practiceLicenseFileId = result.data.practiceLicenseFileId;
                var businessLicenseFileId = result.data.businessLicenseFileId;
                var organizationCodeFileId = result.data.organizationCodeFileId;
                var taxEnrolFileId = result.data.taxEnrolFileId;

                $scope.basicInfoDto.practiceInfo = result.data;

                practiceLicenseFileId && basicInfoService.getPracticeFile(practiceLicenseFileId).success(function(file){
                    $scope.basicInfoDto.practiceLicenseFileId = file.id;
                    $scope.basicInfoDto.practiceLicenseFileName = file.fileName;
                    $scope.basicInfoDto.practiceLicenseFileData = file.fileData;
                    $scope.basicInfoDto.practiceLicenseFileUrl = basicInfoService.getPracticeFileUrl(file.fileData);
                });
                businessLicenseFileId && basicInfoService.getPracticeFile(businessLicenseFileId).success(function(file){
                    $scope.basicInfoDto.businessLicenseFileId = file.id;
                    $scope.basicInfoDto.businessLicenseFileName = file.fileName;
                    $scope.basicInfoDto.businessLicenseFileData = file.fileData;
                    $scope.basicInfoDto.businessLicenseFileUrl = basicInfoService.getPracticeFileUrl(file.fileData);
                });
                organizationCodeFileId && basicInfoService.getPracticeFile(organizationCodeFileId).success(function(file){
                    $scope.basicInfoDto.organizationCodeFileId = file.id;
                    $scope.basicInfoDto.organizationCodeFileName = file.fileName;
                    $scope.basicInfoDto.organizationCodeFileData = file.fileData;
                    $scope.basicInfoDto.organizationCodeFileUrl = basicInfoService.getPracticeFileUrl(file.fileData);
                });
                taxEnrolFileId && basicInfoService.getPracticeFile(taxEnrolFileId).success(function(file){
                    $scope.basicInfoDto.taxEnrolFileId = file.fileData.id;
                    $scope.basicInfoDto.taxEnrolFileName = file.fileName;
                    $scope.basicInfoDto.taxEnrolFileData = file.fileData;
                    $scope.basicInfoDto.taxEnrolFileUrl = basicInfoService.getPracticeFileUrl(file.fileData);
                });

            }, function(result) {
                console.log(arguments);
            });
        });
    }
]);
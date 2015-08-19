angular.module('chApp.charts.controllers').controller('PatientProfileController', ['$scope', '$state', '$timeout', '$stateParams', '$location', 'applicationService', 'pluginsService', 'tabService', 'categoryService', 'patientService',
    function ($scope, $state, $timeout, $stateParams, $location, applicationService, pluginsService, tabService, categoryService, patientService) {
        var patientId = $stateParams.patientId;
        console.log('PatientProfileController');

        //创建view model
        var vm = {};
        $scope.vm = vm;

        //加载患者summary数据
        applicationService.blockUI();
        categoryService.getCategories()
            .then(function (data) {
                vm.categories = data;
            })
            .finally(function () {
                //加载插件(for select2)
                pluginsService.init();
                applicationService.unblockUI();
            });

        patientService.getPatientSummary(patientId)
            .then(function (data) {
                if (data) {
                    vm.Patient = data.Patient;
                    vm.PatientPhotoFileData = data.PatientPhotoFileData;
                    vm.PatientPhotoFileId = data.PatientPhotoFileId;
                    vm.PatientPhotoFileUrl = patientService.getPatientFileUrl(data.PatientPhotoFileData);
                    tabService.openTab('charts.patients', 'charts/patients/{patientId}/profile', '个人信息', { stateName: 'charts.patients.profile', stateParams: { patientId: patientId } }, false);
                    tabService.addTab('charts.patients', 'charts/patients/{patientId}/summary', '医疗小结', { stateName: 'charts.patients.summary', stateParams: { patientId: patientId } }, false);
                    tabService.addTab('charts.patients', 'charts/patients/{patientId}/timeline', '就诊记录', { stateName: 'charts.patients.timeline', stateParams: { patientId: patientId } }, false);
                }
            })
            .finally(function () {
                //加载插件(for select2)
                pluginsService.init();
                //处理日期控件的issue
                if (vm.Patient && vm.Patient.DateOfBirthTime) vm.Patient.DateOfBirthTime = new Date(vm.Patient.DateOfBirthTime).format('yyyy-MM-dd');
                applicationService.unblockUI();
            });

        //保存患者事件
        vm.savePatient = function (position) {
            position = position || '';
            applicationService.blockUI();
            var data = { Patient: vm.Patient, PatientPhotoFileId: vm.PatientPhotoFileId, PatientPhotoFileData: vm.PatientPhotoFileData };
            patientService.savePatient(data)
                .then(function (data) {
                    $scope.$broadcast("noty", {
                        source: 'savePatientSuccess' + position,
                        show: true,
                        text: '保存患者个人信息成功！',
                        type: 'success'
                    });
                })
                .finally(function () {
                    applicationService.unblockUI();
                });
        };
        //让年龄和生日联动
        vm.changeAge = function () {
            if (!vm.Patient.DateOfBirthTime) vm.Patient.Age = null;
            else vm.Patient.Age = new Date().getYear() - new Date(vm.Patient.DateOfBirthTime).getYear();
        };

        $scope.$watch("vm.PatientPhotoFileData", function (newValue, oldValue) {
            $scope.$parent.$broadcast("Photo_File_Data_Change", { PatientPhotoFileData: newValue });
        });
    }
]);
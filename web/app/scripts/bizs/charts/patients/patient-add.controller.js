angular.module('chApp.charts.controllers').controller('PatientAddController', ['$scope', '$state', '$timeout', '$stateParams', '$location', 'applicationService', 'pluginsService', 'tabService', 'categoryService', 'patientService',
    function ($scope, $state, $timeout, $stateParams, $location, applicationService, pluginsService, tabService, categoryService, patientService) {
        //加载tab页
        tabService.openTab('charts', 'charts/addpatient', '新建患者信息', { stateName: 'charts.addpatient', stateParams: $stateParams }, true);

        //定义view model
        var vm = {};
        $scope.vm = vm;

        //定义缺省数据
        vm.patient = {
            MRN: '',
            Image: '',
            FamilyName: '',
            GivenName: '',
            Sex: '',
            DateOfBirth: '',
            Nationality: '',
            Race: '',
            Ethnicity: '',
            PreferredLanguage: '',
            NativePlace: '',
            IDNumber: '',
            Email: '',
            SSN: '',
            BloodType: '',
            MaritalStatus: '',
            MobilePhone: '',
            HomeAddress: '',
            HomeZip: '',
            RegisteredAddress: '',
            RegisteredZip: '',
            Industry: '',
            Company: '',
            WorkAddress: '',
            WorkPhone: '',
            WorkZip: '',
            ContactPerson: '',
            ContactRelationship: '',
            ContactPhone: '',
            Accessed: '',
            ProviderId: '',
            ScheduledDate: '',
            PatientName: '',
            Age: null,
            DateOfBirthTime: null,
            AccessedTime: null,
            ScheduledDateTime: null
        };

        vm.PatientPhotoFileUrl = patientService.getPatientFileUrl();


        //加载下拉选项数据
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

        //保存患者事件
        vm.addPatient = function () {
            applicationService.blockUI();
            patientService.addPatient(vm)
                .then(function (data) {
                    if (data == null || data.Patient == null) {
                        return;
                    }
                    var tabCount = tabService.getTabCount('charts');
                    if (tabCount > 1) {
                        tabService.closeTab('charts', 'charts/addpatient', true);
                    } else {
                        tabService.closeAll('charts');
                        $state.go('charts.list', { providerId: 'all', scheduledDate: 'recent' });
                    }
                    $timeout(function () {
                        $state.go('charts.patients.profile', { patientId: data.Patient.Id });
                    },0);
                })
                .finally(function () {
                    applicationService.unblockUI();
                });
        };
        //关闭按钮事件
        vm.closePage = function () {
            var tabCount = tabService.getTabCount('charts');
            if (tabCount > 1) {
                tabService.closeTab('charts', 'charts/addpatient');
            } else {
                tabService.closeAll('charts');
                $state.go('charts.list', { providerId: 'all', scheduledDate: 'recent' });
            }
        };
        //让年龄和生日联动
        vm.changeAge = function () {
            if (!vm.patient.DateOfBirthTime) vm.patient.Age = null;
            else vm.patient.Age = new Date().getYear() - new Date(vm.patient.DateOfBirthTime).getYear();
        };
    }
]);
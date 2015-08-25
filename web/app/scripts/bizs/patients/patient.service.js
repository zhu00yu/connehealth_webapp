'use strict';

angular.module('chApp.patients.services').factory('patientService', ['$http', '$state', "appConfig", function ($http, $state, appConfig) {
    var service = {};
    var oElements = {};
    var _apiName = "/patients/";
    //获取全部患者
    service.getPatients = function (searchCondition) {
        return $http.get(appConfig.API_HOST + _apiName)
                    .then(getPatientsComplete)
                    .catch(getPatientsFailed);

        function getPatientsComplete(response) {
            return response.data;
        }
        function getPatientsFailed(error) {
            alert('XHR Failed for getPatients.' + error.data);
        }
    };
    service.getPatient = function (patientId) {
        return $http.get(appConfig.API_HOST + _apiName + patientId)
                    .then(getPatientsComplete)
                    .catch(getPatientsFailed);

        function getPatientsComplete(response) {
            return response.data;
        }
        function getPatientsFailed(error) {
            //alert('XHR Failed for getPatients.' + error.data);
        }
    };
    //获取某个患者
    service.getPatientSummary = function (patientId) {
        return $http.get(appConfig.API_HOST + _apiName + patientId + '/summary')
                    .then(getPatientSummaryComplete)
                    .catch(getPatientSummaryFailed);

        function getPatientSummaryComplete(response) {
            return response.data;
        }
        function getPatientSummaryFailed(error) {
            alert('XHR Failed for getPatientSummary.' + error.data);
        }
    };
    //添加某个患者
    service.addPatient = function (patientDto) {
        return $http.post(appConfig.API_HOST + _apiName, patientDto)
                    .then(addPatientSummaryComplete)
                    .catch(addPatientSummaryFailed);

        function addPatientSummaryComplete(response) {
            return response.data;
        }
        function addPatientSummaryFailed(error) {
            alert('XHR Failed for addPatient.' + JSON.stringify(error.data));
        }
    }
    //保存某个患者
    service.savePatient = function (patientId, patient) {
        return $http.put(appConfig.API_HOST + _apiName + patientId, patient)
                    .then(savePatientSummaryComplete)
                    .catch(savePatientSummaryFailed);

        function savePatientSummaryComplete(response) {
            return response.data;
        }
        function savePatientSummaryFailed(error) {
            alert('XHR Failed for savePatient.' + JSON.stringify(error.data));
        }
    }

    service.getPatientFileUrl = function (fileData, fileId) {
        if (fileId) {
            return appConfig.API_HOST + "/patient-files/" + fileId + "/data";
        } else {
            return fileData || "images/patient.svg";
        }
    };

    service.uploadPatientFile = function (fileId, fileName, fileData) {
        var promise = null;
        if (!fileData) {
            var deferred = $q.defer();
            setTimeout(function () {
                deferred.reject("未选择数据文件。");
            }, 500);
            promise = deferred.promise;
        } else {
            var data = {
                id: fileId,
                fileName: fileName,
                fileData: fileData
            };
            promise = $http.post(appConfig.API_HOST + "/patient-files", data);
        }

        return promise;
    };

    service.getPatientFile = function(patientId){
        var promise = $http.get(appConfig.API_HOST + "/patient-files/" + patientId);
        return promise;
    };

    var surnames = ['欧阳','太史','端木','上官','司马','东方','独孤','南宫','万俟','闻人','夏侯','诸葛','尉迟','公羊','赫连','澹台','皇甫','宗政','濮阳','公冶','太叔','申屠','公孙','慕容','仲孙','钟离','长孙','宇文','司徒','鲜于','司空','闾丘','子车','亓官','司寇','巫马','公西','颛孙','壤驷','公良','漆雕','乐正','宰父','谷梁','拓跋','夹谷','轩辕','令狐','段干','百里','呼延','东郭','南门','羊舌','微生','公户','公玉','公仪','梁丘','公仲','公上','公门','公山','公坚','左丘','公伯','西门','公祖','第五','公乘','贯丘','公皙','南荣','东里','东宫','仲长','子书','子桑','即墨','达奚','褚师'];
    service.getPatientNames = function(fullName){
        var ret = { familyName: null,givenName:null };
        if(!fullName){
            return null;
        }

        if (-1 != fullName.indexOf(' ')){
            var names = fullName.split(' ');
            ret.familyName = names[0];
            ret.givenName = names[1];
        } else {
            ret.familyName = fullName.substr(0, 1);
            ret.givenName = fullName.substr(1);
            _.each(surnames, function(surname){
                if (0 == fullName.indexOf(surname)){
                    ret.familyName = surname;
                    ret.givenName = fullName.substr(surname.length);
                }
            });
        }

        return ret;
    };



    service.initWidgets = function (selector, rowDataChangedCallback) {
        var oTable = service.initTable(selector, rowDataChangedCallback);
        oElements = {
            DomTable: oTable,
        };
        return oElements;
    };

    service.initTable = function(selector, rowDataChangedCallback){

        var oTable = $(selector).find(".dataTable");
        var oOrderSetting = [[0, "asc"]];
        var oColumnSetting = [];
        var emptyObj = service.rowDataToObject([]);
        var targets = [0];

        oColumnSetting.push({
            "targets": targets,
            "visible": false,
            "searchable": false
        });
        oColumnSetting.push({
            "targets": [targets.length],
            "sortable": false,
            "searchable": false
        });

        var oTableTools = {
            "sRowSelect": "single",
            "aButtons": [
                {
                    "sExtends": "goto_state",
                    "sButtonText": "添加",
                    "bFullButton": true,
                    "fnClick": function (button, conf) {
                        if (typeof rowDataChangedCallback === "function") {
                            rowDataChangedCallback();
                        }
                    }
                },
                {
                    "sExtends": "goto_state",
                    "sButtonText": "修改",
                    "fnClick": function (button, conf) {
                        if (typeof rowDataChangedCallback === "function") {
                            var oTT = TableTools.fnGetInstance(oTable[0]);
                            var aData = oTT.fnGetSelectedData();
                            aData = aData[0] || [];
                            rowDataChangedCallback(service.rowDataToObject(aData));
                        }
                    }
                },
            ]
        };

        function fnFormatDetails(aData) {
            var data = service.rowDataToObject(aData);
            var oOut = $('<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;"></table>');

            var oRow = $('<tr style="vertical-align: top;"><td><dl class="dl-horizontal"></dl></td><td><dl class="dl-horizontal"></dl></td></tr>');

            var age = 0;
            if (data.dob) {
                age = moment(data.dob).years();
                age = moment().years() - age;
            }
            $('dl:eq(0)', oRow).append('<dt>医疗保险卡号</dt><dd>' + (data.ssn || '') + '</dd>');
            $('dl:eq(0)', oRow).append('<dt>国籍</dt><dd>' + (data.nationality || '') + '</dd>');
            $('dl:eq(0)', oRow).append('<dt>性别</dt><dd>' + (data.sex || '') + '</dd>');
            $('dl:eq(0)', oRow).append('<dt>年龄</dt><dd>' + (age || '') + '</dd>');
            $('dl:eq(0)', oRow).append('<dt>人种</dt><dd>' + (data.ethnicity || '') + '</dd>');

            $('dl:eq(0)', oRow).append('<dt>民族</dt><dd>' + (data.race || '') + '</dd>');
            $('dl:eq(0)', oRow).append('<dt>籍贯</dt><dd>' + (data.nativePlace || '') + '</dd>');
            $('dl:eq(0)', oRow).append('<dt>血型</dt><dd>' + (data.bloodType || '') + '</dd>');
            $('dl:eq(0)', oRow).append('<dt>首选语言</dt><dd>' + (data.preferredLanguage || '') + '</dd>');
            $('dl:eq(0)', oRow).append('<dt>婚姻状况</dt><dd>' + (data.maritalStatus || '') + '</dd>');

            $('dl:eq(1)', oRow).append('<dt>移动电话</dt><dd>' + (data.mobile || '') + '</dd>');
            $('dl:eq(1)', oRow).append('<dt>工作电话</dt><dd>' + (data.workPhone || '') + '</dd>');
            $('dl:eq(1)', oRow).append('<dt>EMAIL</dt><dd>' + (data.email || '') + '</dd>');
            $('dl:eq(1)', oRow).append('<dt>家庭地址</dt><dd>' + (data.homeAddress || '') + '</dd>');
            $('dl:eq(1)', oRow).append('<dt>居住地址</dt><dd>' + (data.registeredAddress || '') + '</dd>');

            $('dl:eq(1)', oRow).append('<dt>工作单位</dt><dd>' + (data.company || '') + '</dd>');
            $('dl:eq(1)', oRow).append('<dt>行业</dt><dd>' + (data.industry || '') + '</dd>');
            $('dl:eq(1)', oRow).append('<dt>单位地址</dt><dd>' + (data.workAddress || '') + '</dd>');
            $('dl:eq(1)', oRow).append('<dt>联系人</dt><dd>' + (data.contactPerson || '') + '</dd>');
            $('dl:eq(1)', oRow).append('<dt>联系人电话</dt><dd>' + (data.contactPhone || '') + '</dd>');
            $(oOut).append(oRow);

            return oOut.html();
        }

        function onRowCreated(row, data, index) {
            var api = this.api();
            var oRow = api.row(row);
            $("td:eq(0)", row).addClass("center")
                .html('<i class="fa fa-plus-square-o"></i>')
                .find('i').click(
                function () {
                    if (oRow.child.isShown()) {
                        /* This row is already open - close it */
                        $(this).removeClass().addClass('fa fa-plus-square-o');
                        oRow.child.hide();
                    } else {
                        /* Open this row */
                        $(this).removeClass().addClass('fa fa-minus-square-o');
                        oRow.child(fnFormatDetails(data)).show();
                    }
                });
        }

        /*  Initialse DataTables, with no sorting on the 'details' column  */
        oTable = oTable.dataTable({
            "dom": "<'toolbar' T>frt<'row'<'col-md-6'i><'spcol-md-6an6'p>>",
            //"dom": "<'row'<'col-md-12'f <'toolbar' T>>>t<'row'<'col-md-6'i><'spcol-md-6an6'p>>",
            "order": oOrderSetting,
            "tableTools": oTableTools,
            "columnDefs": oColumnSetting,
            "createdRow": onRowCreated
        });

        return oTable;

    };

    service.rowDataToObject = function (aData) {
        var i = 0;
        return aData[0] || {
            "id": null,
            "createOn": null,
            "status": 4,
            "createBy": null,
            "modifyBy": null,
            "modifyOn": null,
            "mrn": null,
            "ssn": null,
            "idNo": null,
            "photoId": null,
            "familyName": null,
            "givenName": null,
            "patientName": null,
            "sex": "男",
            "dob": null,
            "bloodType": "O",
            "nationality": "中国",
            "race": "汉族",
            "ethnicity": "黄种人",
            "preferredLanguage": "中文",
            "nativePlace": "北京",
            "email": null,
            "mobile": null,
            "homeAddress": null,
            "homeZip": null,
            "registeredAddress": null,
            "registeredZip": null,
            "workAddress": null,
            "workPhone": null,
            "workZip": null,
            "contactPerson": null,
            "contactRelationship": null,
            "contactPhone": null,
            "industry": null,
            "company": null,
            "maritalStatus": "未婚"
        };
    };

    service.objectToRowData = function (data) {
        return [
            data,
            null,
            data.idNo,
            data.patientName,
            data.sex,
            data.homeAddress,
        ];
    };

    service.reloadDatas = function (datas) {
        var oTable = oElements.DomTable;
        if (oTable && $.fn.DataTable.isDataTable(oTable)) {
            var api = oTable.api();
            api.clear();

            for (var i = 0; datas && i < datas.length; ++i) {
                api.row.add(service.objectToRowData(datas[i]));
            }
            api.draw();
        }
    };

    return service;
}]);
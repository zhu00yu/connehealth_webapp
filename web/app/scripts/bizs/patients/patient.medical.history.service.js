'use strict';

angular.module('chApp.patients.services').factory('patientMedicalHistoriesService', [
    '$http', '$state', '$cookies', '$rootScope', "appConfig",
    function ($http, $state, $cookies, $rootScope, appConfig) {
    var service = {};
    var oElements = {};
    var _apiName = "/patient-medical-histories/";
    //获取全部患者
    service.getMedicalHistories = function (patientId) {
        return $http.get(appConfig.API_HOST + _apiName + "list/" + patientId)
                    .then(getComplete)
                    .catch(getFailed);

        function getComplete(response) {
            var data = response.data;
            _.each(data, function(d){
                d.therapyDate = moment(d.therapyDate).format("YYYY-MM-DD");
                d.recordDate && (d.recordDate = moment(d.recordDate).format("YYYY-MM-DD"));
                d.admissionDate && (d.admissionDate = moment(d.admissionDate).format("YYYY-MM-DD"));
                d.dischargeDate && (d.dischargeDate = moment(d.dischargeDate).format("YYYY-MM-DD"));
            });
            return data;
        }
        function getFailed(error) {
            alert('XHR Failed for getMedicalHistories.' + error.data);
        }
    };
    service.getMedicalHistory = function (historyId) {
        return $http.get(appConfig.API_HOST + _apiName + historyId)
                    .then(getComplete)
                    .catch(getFailed);

        function getComplete(response) {
            var data = response.data;
            data.therapyDate = moment(data.therapyDate).format("YYYY-MM-DD");
            data.recordDate && (data.recordDate = moment(data.recordDate).format("YYYY-MM-DD"));
            data.admissionDate && (data.admissionDate = moment(data.admissionDate).format("YYYY-MM-DD"));
            data.dischargeDate && (data.dischargeDate = moment(data.dischargeDate).format("YYYY-MM-DD"));

            return data;
        }
        function getFailed(error) {
            //alert('XHR Failed for getPatients.' + error.data);
        }
    };

    service.insertMedicalHistory = function (patientId, history) {
        var promise = null;
        if (!patientId) {
            var deferred = $q.defer();
            setTimeout(function () {
                deferred.reject("未指定机构Id。");
            }, 500);
            promise = deferred.promise;
        } else {
            promise = $http.post(appConfig.API_HOST + _apiName, history);
        }

        return promise;
    }

    service.updateMedicalHistory = function (patientId, history) {
        var promise = null;
        if (!patientId) {
            var deferred = $q.defer();
            setTimeout(function () {
                deferred.reject("未指定机构Id。");
            }, 500);
            promise = deferred.promise;
        } else {
            promise = $http.put(appConfig.API_HOST + _apiName + history.id, history);
        }

        return promise;
    }

    service.getDiseaseById = function(diseaseId){
        return $http.get(appConfig.API_HOST + "/master/icd/" + diseaseId)
            .then(getComplete)
            .catch(getFailed);

        function getComplete(response) {
            return response.data;
        }
        function getFailed(error) {
            //alert('XHR Failed for getPatients.' + error.data);
        }
    };

    service.getDischargeSummaryFileUrl = function (fileId, fileName, fileData){
        var url = null;
        fileName = fileName || "DISCHARGE SUMMARY.pdf";
        if (fileId){
            var user = $rootScope.currentUser || {};
            var token = user.token;
            url = appConfig.API_HOST + "/patient-files/" + fileId + "/data/"+fileName+"?token=" + token;
        }

        return fileData || url;
    };




    service.initWidgets = function (practiceId, selector, oTable, insertModal, editModal, rowDataChangedCallback, selectIcdCallback) {
        insertModal = service.initInsertModal(practiceId, selector, insertModal, selectIcdCallback);
        editModal = service.initEditModal(practiceId, selector, editModal, selectIcdCallback);
        oTable = service.initTable(selector, oTable, insertModal, editModal, rowDataChangedCallback);
        oElements = {
            DomTable: oTable,
            DomInsertModal: insertModal,
            DomEditModal: editModal
        };
        return oElements;
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

            "patientId": null,
            "problem": null,
            "therapy": null,
            "goals": null,
            "outcome": null,
            "practiceName": null,
            "attendingDoctor": null,
            "anesthetist": null,
            "therapyDate": null,
            "recordDate": null,
            "hospitalized": false,
            "residency": null,
            "admissionDate": null,
            "dischargeDate": null,
            "dischargeSummaryFileId": null,
            "memo": null,
        };
    };

    service.objectToRowData = function (data) {
        return [
            data,
            null,
            data.problem,
            data.outcome,
            data.therapyDate
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

    service.initTable = function (selector, oTable, insertModal, editModal, rowDataChangedCallback) {
        if (oTable) {
            oTable.destroy();
            //oTable.empty();
        }

        oTable = $(selector).find(".medicalHistoryList.dataTable");
        var oOrderSetting = [[2, "desc"]];
        var oColumnSetting = [];
        var emptyObj = service.rowDataToObject([]);
        var targets = [0];

        oColumnSetting.push({
            "targets": targets,
            "visible": false,
            "searchable": false
        });
        oColumnSetting.push({
            "targets": 1,
            "sortable": false,
            "searchable": false,
            "width": "10px;"
        });
        oColumnSetting.push({
            "targets": 2,
            "width": "80px;"
        });

        var oTableTools = {
            "sRowSelect": "single",
            "aButtons": [
                {
                    "sExtends": "open_modal",
                    "sButtonText": "添加",
                    "bFullButton": true,
                    "oDomModal": insertModal,
                    "fnModalShown": function (e) {
                        if (typeof rowDataChangedCallback === "function") {
                            rowDataChangedCallback(emptyObj);
                        }
                    }
                },
                {
                    "sExtends": "open_modal",
                    "sButtonText": "修改",
                    "oDomModal": editModal,
                    "fnModalShown": function (e) {
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

            $('dl:eq(0)', oRow).append('<dt style="width:80px">治疗日期</dt><dd style="margin-left:100px">' + (data.therapyDate || '') + '</dd>');
            $('dl:eq(1)', oRow).append('<dt style="width:80px">治疗地点</dt><dd style="margin-left:100px">' + (data.practiceName || '') + '</dd>');
            $('dl:eq(0)', oRow).append('<dt style="width:80px">主治医生</dt><dd style="margin-left:100px">' + (data.attendingDoctor || '') + '</dd>');
            $('dl:eq(1)', oRow).append('<dt style="width:80px">麻醉师</dt><dd style="margin-left:100px">' + (data.anesthetist || '') + '</dd>');

            if(data.hospitalized){
                var fileId = data.dischargeSummaryFileId;
                var fileUrl = service.getDischargeSummaryFileUrl(fileId);

                $('dl:eq(0)', oRow).append('<dt style="width:80px">入院日期</dt><dd style="margin-left:100px">' + (data.admissionDate || '') + '</dd>');
                $('dl:eq(1)', oRow).append('<dt style="width:80px">住院医生</dt><dd style="margin-left:100px">' + (data.residency || '') + '</dd>');
                $('dl:eq(0)', oRow).append('<dt style="width:80px">出院日期</dt><dd style="margin-left:100px">' + (data.dischargeDate || '') + '</dd>');
                if (fileUrl){
                    $('dl:eq(1)', oRow).append('<dt style="width:80px">出院小结</dt><dd style="margin-left:100px"><a target="_blank" href="' + (fileUrl||'') + '">查看</a></dd>');
                }
            }
            $(oOut).append(oRow);

            oRow =  $('<tr style="vertical-align: top;"><td colspan="2"><dl class="dl-horizontal"></dl></td></tr>');
            $('dl:eq(0)', oRow).append('<dt style="width:80px">治疗项目</dt><dd style="margin-left:100px">' + (data.therapy || '') + '</dd>');
            $('dl:eq(0)', oRow).append('<dt style="width:80px">治疗目标</dt><dd style="margin-left:100px">' + (data.goals || '') + '</dd>');
            $('dl:eq(0)', oRow).append('<dt style="width:80px">备注</dt><dd style="margin-left:100px">' + (data.memo || '') + '</dd>');
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
            "autoWidth": false,
            "pageLength": 5,
            "dom": "<'toolbar' T>frt<'row'<'col-md-6'i><'col-md-6'p>>",
            //"dom": "<'row'<'col-md-12'f <'toolbar' T>>>t<'row'<'col-md-6'i><'col-md-6'p>>",
            "order": oOrderSetting,
            "tableTools": oTableTools,
            "columnDefs": oColumnSetting,
            "createdRow": onRowCreated
        });

        return oTable;
    };

    service.initInsertModal = function (practiceId, selector, insertModal, selectIcdCallback) {
        var token = $cookies.get(appConfig.CH_AU_T_NAME);
        var tokenName = appConfig.CH_AU_T_NAME;

        var oModal = $(insertModal || ".insertMedicalHistoryModal", selector);


        return oModal;
    }

    service.initEditModal = function (practiceId, selector, editModal, selectIcdCallback) {
        var oModal = $(editModal || ".editMedicalHistoryModal", selector);

        var token = $cookies.get(appConfig.CH_AU_T_NAME);
        var tokenName = appConfig.CH_AU_T_NAME;


        return oModal;
    }

    service.closeModals = function () {
        oElements.DomInsertModal.modal("hide");
        oElements.DomEditModal.modal("hide");
    };




    return service;
}]);
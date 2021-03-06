﻿'use strict';

angular.module('chApp.patients.services').factory('patientProblemsService', [
    '$http', '$state', '$cookies', "appConfig",
    function ($http, $state, $cookies, appConfig) {
    var service = {};
    var oElements = {};
    var _apiName = "/patient-problems/";
    //获取全部患者
    service.getProblems = function (patientId) {
        return $http.get(appConfig.API_HOST + _apiName + "list/" + patientId)
                    .then(getComplete)
                    .catch(getFailed);

        function getComplete(response) {
            var data = response.data;
            _.each(data, function(d){
                d.startDate = moment(d.startDate).format("YYYY-MM-DD");
                d.endDate && (d.endDate = moment(d.endDate).format("YYYY-MM-DD"));
            });
            return data;
        }
        function getFailed(error) {
            alert('XHR Failed for getPatientProblems.' + error.data);
        }
    };
    service.getProblem = function (problemId) {
        return $http.get(appConfig.API_HOST + _apiName + problemId)
                    .then(getComplete)
                    .catch(getFailed);

        function getComplete(response) {
            return response.data;
        }
        function getFailed(error) {
            //alert('XHR Failed for getPatients.' + error.data);
        }
    };

    service.insertProblem = function (patientId, problem) {
        var promise = null;
        if (!patientId) {
            var deferred = $q.defer();
            setTimeout(function () {
                deferred.reject("未指定机构Id。");
            }, 500);
            promise = deferred.promise;
        } else {
            promise = $http.post(appConfig.API_HOST + _apiName, problem);
        }

        return promise;
    }

    service.updateProblem = function (patientId, problem) {
        var promise = null;
        if (!patientId) {
            var deferred = $q.defer();
            setTimeout(function () {
                deferred.reject("未指定机构Id。");
            }, 500);
            promise = deferred.promise;
        } else {
            promise = $http.put(appConfig.API_HOST + _apiName + problem.id, problem);
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
            "diseaseId": null,
            "problemName": null,
            "icdNo": null,
            "currentStatus": null,
            "severity": null,
            "startDate": null,
            "endDate": null,
            "memo": null
        };
    };

    service.objectToRowData = function (data) {
        return [
            data,
            null,
            data.problemName,
            data.currentStatus,
            [data.startDate, data.endDate || "现在"].join(" => "),
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

        oTable = $(selector).find(".problemList.dataTable");
        var oOrderSetting = [[3, "desc"]];
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
            "targets": 3,
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

            $('dl:eq(0)', oRow).append('<dt style="width:120px">ICD编码</dt><dd style="margin-left:140px">' + (data.icdNo || '') + '</dd>');
            $('dl:eq(1)', oRow).append('<dt style="width:120px">严重程度</dt><dd style="margin-left:140px">' + (data.severity || '') + '</dd>');
            $(oOut).append(oRow);

            oRow =  $('<tr style="vertical-align: top;"><td colspan="2"><dl class="dl-horizontal"></dl></td></tr>');
            $('dl:eq(0)', oRow).append('<dt style="width:120px">备注</dt><dd style="margin-left:140px">' + (data.memo || '') + '</dd>');
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

        var oModal = $(insertModal || ".insertProblemModal", selector);

        var icdSearch = oModal.find('.icdSearch');

        function format(state) {
            var state_id = state.id;
            return state.text;
        }

        $(icdSearch).select2("destroy");
        $(icdSearch).select2({
            formatResult: format,
            formatSelection: format,
            minimumInputLength: 1,
            minimumResultsForSearch: 1,
            dropdownCssClass: 'form-white',
            ajax: {
                transport: function (params) {
                    params.beforeSend = function (request) {
                        request.setRequestHeader("Content-Type", "application/json");
                        request.setRequestHeader(tokenName, token);
                    };
                    return $.ajax(params);
                },
                url: appConfig.API_HOST + "/master/icd/query/options",
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params, // search term
                        //page: params.page
                    };
                },
                results: function (data, page) {
                    // parse the results into the format expected by Select2.
                    // since we are using custom formatting functions we do not need to
                    // alter the remote JSON data
                    return {
                        results: data
                    };
                },
                cache: true
            }
        });

        $(icdSearch).on("select2-selected", function (e) {
            var diseaseId = e.choice.id;
            service.getDiseaseById(diseaseId).then(function (result) {
                if (typeof selectIcdCallback === "function") {
                    selectIcdCallback(result);
                }
            });
        });

        //selector && selector.select2("val", initValue);

        return oModal;
    }

    service.initEditModal = function (practiceId, selector, editModal, selectIcdCallback) {
        var oModal = $(editModal || ".editProblemModal", selector);

        var token = $cookies.get(appConfig.CH_AU_T_NAME);
        var tokenName = appConfig.CH_AU_T_NAME;

        var icdSearch = oModal.find('.icdSearch');

        function format(state) {
            var state_id = state.id;
            return state.text;
        }

        $(icdSearch).select2("destroy");
        $(icdSearch).select2({
            formatResult: format,
            formatSelection: format,
            minimumInputLength: 1,
            minimumResultsForSearch: 1,
            dropdownCssClass: 'form-white',
            ajax: {
                transport: function (params) {
                    params.beforeSend = function (request) {
                        request.setRequestHeader("Content-Type", "application/json");
                        request.setRequestHeader(tokenName, token);
                    };
                    return $.ajax(params);
                },
                url: appConfig.API_HOST + "/master/icd/query/options",
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        q: params, // search term
                        //page: params.page
                    };
                },
                results: function (data, page) {
                    // parse the results into the format expected by Select2.
                    // since we are using custom formatting functions we do not need to
                    // alter the remote JSON data
                    return {
                        results: data
                    };
                },
                cache: true
            }
        });

        $(icdSearch).on("select2-selected", function (e) {
            var diseaseId = e.choice.id;
            service.getDiseaseById(diseaseId).then(function (result) {
                if (typeof selectIcdCallback === "function") {
                    selectIcdCallback(result.data);
                }
            });
        });

        //selector && selector.select2("val", initValue);

        return oModal;
    }

    service.closeModals = function () {
        oElements.DomInsertModal.modal("hide");
        oElements.DomEditModal.modal("hide");
    };




    return service;
}]);
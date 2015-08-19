'use strict';

angular.module('chApp.practice.services').factory('employeesService',
[
    "$state", "$http", "$rootScope", '$cookies', '$q', "appConfig",
    function ($state, $http, $rootScope, $cookies, $q, appConfig) {

        var service = {};
        var _apiName = "/employees/";

        var oElements = {};

        service.getEmployees = function (practiceId) {
            var promise = null;
            if (!practiceId) {
                var deferred = $q.defer();
                setTimeout(function () {
                    deferred.reject("未指定机构Id。");
                }, 500);
                promise = deferred.promise;
            } else {
                promise = $http.get(appConfig.API_HOST + _apiName + "practice/" + practiceId);
            }

            return promise;
        };

        service.getEmployee = function (practiceId, employeeId) {
            var promise = null;
            if (!practiceId) {
                var deferred = $q.defer();
                setTimeout(function () {
                    deferred.reject("未指定机构Id。");
                }, 500);
                promise = deferred.promise;
            } else {
                promise = $http.get(appConfig.API_HOST + _apiName + employeeId);
            }

            return promise;
        }

        service.getEmployeeByUser = function (practiceId, userId) {
            var promise = null;
            if (!practiceId) {
                var deferred = $q.defer();
                setTimeout(function () {
                    deferred.reject("未指定机构Id。");
                }, 500);
                promise = deferred.promise;
            } else {
                promise = $http.get(appConfig.API_HOST + _apiName + practiceId + "/" + userId);
            }

            return promise;
        }

        service.insertEmployee = function (practiceId, employee) {
            var promise = null;
            if (!practiceId) {
                var deferred = $q.defer();
                setTimeout(function () {
                    deferred.reject("未指定机构Id。");
                }, 500);
                promise = deferred.promise;
            } else {
                employee.practiceId = practiceId;
                employee.provider.practiceLocation = employee.provider.practiceLocation.join("|");
                employee.provider.specialties = employee.provider.specialties.join("|");
                delete employee.practice;
                promise = $http.post(appConfig.API_HOST + _apiName, employee);
            }

            return promise;
        }

        service.updateEmployee = function (practiceId, employee) {
            var promise = null;
            if (!practiceId) {
                var deferred = $q.defer();
                setTimeout(function () {
                    deferred.reject("未指定机构Id。");
                }, 500);
                promise = deferred.promise;
            } else {
                promise = $http.put(appConfig.API_HOST + _apiName, employee);
            }

            return promise;
        }




        service.initWidgets = function (practiceId, selector, oTable, insertModal, editModal, rowDataChangedCallback) {
            insertModal = service.initInsertModal(practiceId, selector, insertModal, rowDataChangedCallback);
            editModal = service.initEditModal(practiceId, selector, editModal);
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
                "practiceId": null,
                "userId": null,
                "manager": false,
                "practice": null,
                "provider": {
                    "id": null,
                    "createOn": null,
                    "status": 4,
                    "createBy": null,
                    "modifyBy": null,
                    "modifyOn": null,
                    "applyOn": null,
                    "approveOn": null,
                    "approveBy": null,
                    "certificateNo": null,
                    "practiceNo": null,
                    "practiceLocation": null,
                    "primaryPracticeName": null,
                    "professionalRank": null,
                    "specialties": null,
                    "skills": null,
                    "approved": false,
                    "userProfile": null
                }
            };
        };

        service.objectToRowData = function (data) {
            return [
                data,
                null,
                data.provider.certificateNo,
                data.provider.userProfile.familyName + data.provider.userProfile.givenName,
                data.provider.userProfile.sex,
                data.provider.professionalRank,
                data.provider.specialties,
                data.provider.skills
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

            oTable = $(selector).find(".dataTable");
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
                        "sExtends": "open_modal",
                        "sButtonText": "添加",
                        "bFullButton": true,
                        "oDomModal": insertModal,
                        "fnModalShown": function (e) {
                            if (typeof rowDataChangedCallback === "function") {
                                var oTT = TableTools.fnGetInstance(oTable[0]);
                                var aData = oTT.fnGetSelectedData();
                                aData = aData[0] || [];
                                rowDataChangedCallback(service.rowDataToObject(aData));
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

                $('dl:eq(0)', oRow).append('<dt>医师资格证编码</dt><dd>' + (data.provider.certificateNo || '') + '</dd>');
                $('dl:eq(0)', oRow).append('<dt>医师职称</dt><dd>' + (data.provider.professionalRank || '') + '</dd>');
                $('dl:eq(0)', oRow).append('<dt>医师专科</dt><dd>' + (data.provider.specialties || '') + '</dd>');
                $('dl:eq(0)', oRow).append('<dt>医师技能</dt><dd>' + (data.provider.skills || '') + '</dd>');

                $('dl:eq(1)', oRow).append('<dt>医师执业证编码</dt><dd>' + (data.provider.practiceNo || '') + '</dd>');
                $('dl:eq(1)', oRow).append('<dt>医师执业地区</dt><dd>' + (data.provider.practiceLocation || '') + '</dd>');
                $('dl:eq(1)', oRow).append('<dt>第一执业机构</dt><dd>' + (data.provider.primaryPracticeName || '') + '</dd>');
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

        service.initInsertModal = function (practiceId, selector, insertModal, rowDataChangedCallback) {
            var token = $cookies.get(appConfig.CH_AU_T_NAME);
            var tokenName = appConfig.CH_AU_T_NAME;

            var oModal = $(insertModal || ".insertModal", selector);

            var userSelector = oModal.find('.userSearch');

            function format(state) {
                var state_id = state.id;
                return state.text;
            }

            $(userSelector).select2("destroy");
            $(userSelector).select2({
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
                    url: appConfig.API_HOST + _apiName + "practice/" + practiceId + "/users",
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

            $(userSelector).on("select2-selected", function (e) {
                var userId = e.choice.id;
                service.getEmployeeByUser(practiceId, userId).then(function (result) {
                    result.data.provider.userProfile.dob = moment(+result.data.provider.userProfile.dob).format("YYYY-MM-DD");
                    if (typeof rowDataChangedCallback === "function") {
                        rowDataChangedCallback(result.data);
                    }
                });
            });

            //selector && selector.select2("val", initValue);

            return oModal;
        }

        service.initEditModal = function (practiceId, selector, editModal, rowDataChangedCallback) {
            var oModal = $(editModal || ".editModal", selector);
            return oModal;
        }

        service.closeModals = function () {
            oElements.DomInsertModal.modal("hide");
            oElements.DomEditModal.modal("hide");
        };


        return service;
    }
]);
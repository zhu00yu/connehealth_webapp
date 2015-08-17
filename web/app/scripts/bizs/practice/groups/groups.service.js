'use strict';

angular.module('chApp.practice.services').factory('groupsService',
[
    "$state", "$http", "$rootScope", '$cookies', '$q', "appConfig",
    function ($state, $http, $rootScope, $cookies, $q, appConfig) {

        var service = {};
        var _apiName = "/api/Practices/";

        var currentGroup = {};
        var oElements = {};

        service.getGroups = function(practiceId) {
            var promise = null;
            if (!practiceId) {
                var deferred = $q.defer();
                setTimeout(function () {
                    deferred.reject("未指定机构Id。");
                }, 500);
                promise = deferred.promise;
            } else {
                promise = $http.get(appConfig.API_HOST + _apiName + practiceId + "/Groups");
            }

            return promise;
        };

        service.getGroup = function (practiceId, groupId) {
            var promise = null;
            if (!practiceId) {
                var deferred = $q.defer();
                setTimeout(function () {
                    deferred.reject("未指定科室Id。");
                }, 500);
                promise = deferred.promise;
            } else {
                promise = $http.get(appConfig.API_HOST + _apiName + practiceId + "/Groups/" + groupId);
            }

            return promise;
        }

        service.insertGroup = function (practiceId, group) {
            var promise = null;
            if (!practiceId) {
                var deferred = $q.defer();
                setTimeout(function () {
                    deferred.reject("未指定科室Id。");
                }, 500);
                promise = deferred.promise;
            } else {
                group.PracticeId = practiceId;
                promise = $http.post(appConfig.API_HOST + _apiName + practiceId + "/Groups/Insert", group);
            }

            return promise;
        }

        service.updateGroup = function (practiceId, group) {
            var promise = null;
            if (!practiceId) {
                var deferred = $q.defer();
                setTimeout(function () {
                    deferred.reject("未指定科室Id。");
                }, 500);
                promise = deferred.promise;
            } else {
                promise = $http.post(appConfig.API_HOST + _apiName + practiceId + "/Groups/Update", group);
            }

            return promise;
        }


        service.initWidgets = function (selector, oTable, insertModal, editModal, rowDataChangedCallback) {
            insertModal = service.initInsertModal(selector, insertModal);
            editModal = service.initEditModal(selector, editModal);
            oTable = service.initTable(selector, oTable, insertModal, editModal, rowDataChangedCallback);
            oElements = {
                DomTable: oTable,
                DomInsertModal: insertModal,
                DomEditModal: editModal
            };
            return oElements;
        };

        service.initInsertModal = function (selector, insertModal) {
            var oModal = $(insertModal || ".insertModal", selector);
            return oModal;
        }

        service.initEditModal = function (selector, editModal) {
            var oModal = $(editModal || ".editModal", selector);
            return oModal;
        }

        service.closeModals = function() {
            oElements.DomInsertModal.modal("hide");
            oElements.DomEditModal.modal("hide");
        };

        service.initTable = function (selector, oTable, insertModal, editModal, rowDataChangedCallback) {
            if (oTable) {
                oTable.destroy();
                //oTable.empty();
            }

            oTable = $(selector).find(".dataTable");
            var oOrderSetting = [[0, "asc"]];
            var oColumnSetting = [
                {
                    "targets": [0],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [1],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [2],
                    "sortable": false,
                    "searchable": false
                }
            ];
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
                        "fnModalShown": function(e) {
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

            function fnFormatDetails(aData, nTr) {
                var funcs = aData[4];
                var sOut = $('<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;"></table>');

                $(sOut).append("<tr><td>功能列表</td></tr>");

                funcs = funcs.split(",");
                for (var i in funcs) {
                    $(sOut).append("<tr><td>" + funcs[i] + "</td></tr>");
                }

                return sOut.html();
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
                "dom": '<"toolbar" T>frtip',
                "order": oOrderSetting,
                "tableTools": oTableTools,
                "columnDefs": oColumnSetting,
                "createdRow": onRowCreated
            });

            return oTable;
        };

        service.rowDataToObject = function(aData) {
            return {
                Id: aData[0],
                PracticeId: aData[1],
                Name: aData[3],
                Functions: aData[4]
            };
        };

        service.objectToRowData = function(data) {
            return [data.Id, data.PracticeId, null, data.Name, data.Functions];
        };

        service.reloadDatas = function (datas) {
            var oTable = oElements.DomTable;
            if (oTable && $.fn.DataTable.isDataTable(oTable)) {
                var api = oTable.api();
                api.clear();

                for (var i = 0; datas && i < datas.length; ++i) {
                    api.row.add(service.objectToRowData(datas[i])).draw();
                }
            }
        };



        return service;
    }
]);
'use strict';

angular.module('chApp.patients.services').factory('patientAllergiesService', [
    '$http', '$state', '$cookies', "appConfig",
    function ($http, $state, $cookies, appConfig) {
    var service = {};
    var oElements = {};
    var _apiName = "/patient-allergies/";
    //获取全部患者
    service.getAllergies = function (patientId) {
        return $http.get(appConfig.API_HOST + _apiName + "list/" + patientId)
                    .then(getComplete)
                    .catch(getFailed);

        function getComplete(response) {
            var data = response.data;
            _.each(data, function(d){
                d.startDate = moment(d.startDate).format("YYYY-MM-DD");
            });
            return data;
        }
        function getFailed(error) {
            alert('XHR Failed for getPatientProblems.' + error.data);
        }
    };
    service.getAllergy = function (problemId) {
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

    service.insertAllergy = function (patientId, allergy) {
        var promise = null;
        if (!patientId) {
            var deferred = $q.defer();
            setTimeout(function () {
                deferred.reject("未指定机构Id。");
            }, 500);
            promise = deferred.promise;
        } else {
            promise = $http.post(appConfig.API_HOST + _apiName, allergy);
        }

        return promise;
    }

    service.updateAllergy = function (patientId, allergy) {
        var promise = null;
        if (!patientId) {
            var deferred = $q.defer();
            setTimeout(function () {
                deferred.reject("未指定机构Id。");
            }, 500);
            promise = deferred.promise;
        } else {
            promise = $http.put(appConfig.API_HOST + _apiName + allergy.id, allergy);
        }

        return promise;
    }

    service.getAllergenById = function(allergenId){
        return $http.get(appConfig.API_HOST + "/master/allergen/" + allergenId)
            .then(getComplete)
            .catch(getFailed);

        function getComplete(response) {
            return response.data;
        }
        function getFailed(error) {
            //alert('XHR Failed for getPatients.' + error.data);
        }
    };
    service.getReactionById = function(reactionId){
        return $http.get(appConfig.API_HOST + "/master/adverse-reaction/" + reactionId)
            .then(getComplete)
            .catch(getFailed);

        function getComplete(response) {
            return response.data;
        }
        function getFailed(error) {
            //alert('XHR Failed for getPatients.' + error.data);
        }
    };




    service.initWidgets = function (practiceId, selector, oTable, insertModal, editModal, rowDataChangedCallback, selectAllergenCallback, selectReactionCallback) {
        insertModal = service.initInsertModal(practiceId, selector, insertModal, selectAllergenCallback, selectReactionCallback);
        editModal = service.initEditModal(practiceId, selector, editModal, selectAllergenCallback, selectReactionCallback);
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
            "createBy": null,
            "modifyBy": null,
            "modifyOn": null,
            "status": 4,

            "patientId": null,
            "allergenId": null,
            "allergenName": null,
            "allergenType": null,
            "stage": null,
            "currentStatus": null,
            "severity": null,
            "startDate": null,
            "memo": null,
            "reactions": null
        };
    };

    service.objectToRowData = function (data) {
        return [
            data,
            null,
            data.allergenType,
            data.allergenName,
            data.currentStatus,
            data.severity
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

        oTable = $(selector).find(".allergyList.dataTable");
        var oOrderSetting = [[4, "desc"]];
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
            "targets": 4,
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

            $('dl:eq(0)', oRow).append('<dt style="width:120px">时期</dt><dd style="margin-left:140px">' + (data.stage || '') + '</dd>');
            $('dl:eq(1)', oRow).append('<dt style="width:120px">发现时间</dt><dd style="margin-left:140px">' + (data.startDate || '') + '</dd>');
            $(oOut).append(oRow);

            oRow =  $('<tr style="vertical-align: top;"><td colspan="2"><dl class="dl-horizontal"></dl></td></tr>');
            var reactions = '';
            data.reactions && (reactions = _.map(data.reactions, function(r){return r.reaction}).join(';'));
            $('dl:eq(0)', oRow).append('<dt style="width:120px">不良反应</dt><dd style="margin-left:140px">' + (reactions || '') + '</dd>');
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

    service.initInsertModal = function (practiceId, selector, insertModal, selectAllergenCallback, selectReactionCallback) {
        var token = $cookies.get(appConfig.CH_AU_T_NAME);
        var tokenName = appConfig.CH_AU_T_NAME;

        var oModal = $(insertModal || ".insertAllergyModal", selector);

        var allergenSearch = oModal.find('.allergenSearch');
        var reactionSearch = oModal.find('.reactionSearch');

        function format(state) {
            var state_id = state.id;
            return state.text;
        }

        $(allergenSearch).select2("destroy");
        $(allergenSearch).select2({
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
                url: appConfig.API_HOST + "/master/allergen/query/options",
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
        $(allergenSearch).on("select2-selected", function (e) {
            var diseaseId = e.choice.id;
            service.getAllergenById(diseaseId).then(function (result) {
                if (typeof selectAllergenCallback === "function") {
                    selectAllergenCallback(result);
                }
            });
        });


        $(reactionSearch).select2("destroy");
        $(reactionSearch).select2({
            tags: true,
            //multiple: true,
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
                url: appConfig.API_HOST + "/master/adverse-reaction/query/options",
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
        $(reactionSearch).on("change", function (e) {
            var data = $(this).select2("data");
            if (typeof selectReactionCallback === "function"){
                selectReactionCallback(data);
            }
        });


        return oModal;
    }
    service.initEditModal = function (practiceId, selector, editModal, selectAllergenCallback, selectReactionCallback) {
        var oModal = $(editModal || ".editAllergyModal", selector);

        var token = $cookies.get(appConfig.CH_AU_T_NAME);
        var tokenName = appConfig.CH_AU_T_NAME;

        var allergenSearch = oModal.find('.allergenSearch');
        var reactionSearch = oModal.find('.reactionSearch');

        function format(state) {
            var state_id = state.id;
            return state.text;
        }

        $(allergenSearch).select2("destroy");
        $(allergenSearch).select2({
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
                url: appConfig.API_HOST + "/master/allergen/query/options",
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
        $(allergenSearch).on("select2-selected", function (e) {
            var diseaseId = e.choice.id;
            service.getAllergenById(diseaseId).then(function (result) {
                if (typeof selectAllergenCallback === "function") {
                    selectAllergenCallback(result);
                }
            });
        });


        $(reactionSearch).select2("destroy");
        $(reactionSearch).select2({
            tags: true,
            //multiple: true,
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
                url: appConfig.API_HOST + "/master/adverse-reaction/query/options",
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
        $(reactionSearch).on("change", function (e) {
            var data = $(this).select2("data");
            if (typeof selectReactionCallback === "function"){
                selectReactionCallback(data);
            }
        });

        return oModal;
    }

    service.closeModals = function () {
        oElements.DomInsertModal.modal("hide");
        oElements.DomEditModal.modal("hide");
    };

    service.initAllergenSelectorValue = function(allergen){
        var selects = [$(".allergenSearch:input", oElements.DomInsertModal),$(".allergenSearch:input", oElements.DomEditModal)];
        var tags = [];
        var vals = [];
        tags.push({id: allergen.id, text: allergen.name});
        _.each(selects, function(s){
            if (tags.length > 0){
                $(s).select2("data", tags);
            } else{
                $(s).select2("val", "");
            }
        });
    };
    service.initReactionSelectorValue = function(reactions){
        var selects = [$(".reactionSearch:input", oElements.DomInsertModal),$(".reactionSearch:input", oElements.DomEditModal)];
        var tags = [];
        var vals = [];
        _.each(reactions, function(r){
            tags.push({id: r.adverseReactionId, text: r.reaction});
            vals.push(r.adverseReactionId);
        });
        _.each(selects, function(s){
            if (tags.length > 0){
                $(s).select2("data", tags);
            } else{
                $(s).select2("val", "");
            }
        });
    };




    return service;
}]);
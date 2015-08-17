$(function () {
    
    function initTableToolsButtons() {
        $.fn.dataTable.TableTools.buttons.open_modal = $.extend(
            true,
            {},
            $.fn.dataTable.TableTools.buttonBase,
            {
                "oDomModal": null,
                "sButtonText": "Open",
                "bFullButton": false,
                "bSingleButton": true,
                "fnInit": function (button, conf) {
                    var oModal = conf.oDomModal;
                    var bDisable = !conf.bFullButton;
                    var fnModalShown = conf.fnModalShown;
                    var fnModalClosed = conf.fnModalClosed;

                    $(button).toggleClass("disabled", bDisable);

                    if (oModal && typeof fnModalShown === "function") {
                        oModal.on("shown.bs.modal", function (e) {
                            //console.log(arguments);
                            fnModalShown(e);
                        });
                    }

                    if (oModal && typeof fnModalClosed === "function") {
                        oModal.on("hidden.bs.modal", function (e) {
                            //console.log(arguments);
                            fnModalClosed(e);
                        });
                    }
                },
                "fnSelect": function (button, conf, row ) {
                    var bDisable = !conf.bSingleButton;
                    $(button).toggleClass("disabled", bDisable);
                },
                "fnClick": function (button, conf) {
                    var oModal = conf.oDomModal;

                    oModal && oModal.modal("show");
                }
            }
        );
    }

    if ($.fn.dataTable && $.fn.dataTable.TableTools) {
        initTableToolsButtons();
    }

});
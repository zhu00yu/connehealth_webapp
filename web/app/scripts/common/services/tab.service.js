'use strict';

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('chApp.common.services')
    .service('tabService', function () {
        var service = this;

        var _tabs = {};
        var _selectedTabs = {};
        /*var _selectedPageKey = null;
        var _selectedUISref = null;
        var _selectedTab = null;*/

        service.getTabs = function (groupName) {
            if (!_tabs[groupName]) _tabs[groupName] = [];
            return _tabs[groupName];
        };

        service.getSelectedTab = function (groupName) {
            if (!_selectedTabs[groupName]) _selectedTabs[groupName] = {
                tabId: null
            };
            return _selectedTabs[groupName];
        };

        service.getTab = function (groupName, tabId) {
            var tabs = service.getTabs(groupName);
            for (var i in tabs) {
                var tab = tabs[i];
                if (tab.tabId == tabId) return tab;
            }
            return null;
        };

        service.addTab = function (groupName, tabId, tabName, state, canClose) {
            var tab = service.getTab(groupName, tabId);
            if (!tab) {
                tab = {
                    groupName: groupName,
                    tabId: tabId,
                    tabName: tabName,
                    state: state,
                    canClose: canClose,
                    isSelected: false
                };
                var tabs = service.getTabs(groupName);
                if (canClose) tabs.push(tab);
                else{
                    var pos = 0;
                    for (var i = 0; i < tabs.length; ++i) {
                        if (tabs[i].canClose) break;
                        pos = i + 1;
                    }
                    tabs.splice(pos, 0, tab);
                }
            } else {
                tab.tabName = tabName;
                tab.state = $.extend({}, state);
                tab.canClose = canClose;
            }
            return tab;
        };

        service.openTab = function (groupName, tabId, tabName, state, canClose) {
            //console.log('service.openTab("' + groupName + '","' + tabId + '","' + tabName + '","' + JSON.stringify(state));
            var tab = service.addTab(groupName, tabId, tabName, state, canClose);
            var selectedTab = service.getSelectedTab(groupName);
            if (tab.tabId == selectedTab.tabId) return tab;
            
            selectedTab.tabId = tab.tabId;
            service.selectTab(groupName, tab.tabId);
        };

        service.isSelected = function (groupName, tabId) {
            var selectedTab = service.getSelectedTab(groupName);
            return selectedTab.tabId == tabId;
        };

        service.closeTab = function(groupName, tabId, notChangePage) {
            var toTab = null;
            var toTabPos = null;
            var nearTab = null;

            var tabs = service.getTabs(groupName);

            if (tabs.length === 1) {
                return false;
            }
            var opened = 0;
            for (var i = 0; i < tabs.length; ++i) {
                if (tabs[i] && tabs[i].tabId === tabId) {
                    toTab = tabs[i];
                    toTabPos = i;
                    nearTab = i === 0 ? tabs[1] : tabs[i - 1];
                }

                if (tabs[i] && tabs[i].isClosed === false) {
                    ++opened;
                }
            }

            if (opened === 1) {
                return false;
            }

            if (!toTab) {
                return false;
            }

            tabs.splice(toTabPos, 1);
            if (!service.isSelected(groupName, toTab.tabId) && !notChangePage) {
                var selectedTab = service.getSelectedTab(groupName, toTab.tabId);
                selectedTab.tabId = nearTab.tabId;
                service.selectTab(groupName, selectedTab.tabId);
            }
        }

        service.closeAll = function (groupName) {
            var tabs = service.getTabs(groupName);
            var selectedTab = service.getSelectedTab(groupName);
            tabs.splice(0, tabs.length);
            selectedTab.tabId = null;
        };

        service.getTabCount = function (groupName) {
            var tabs = service.getTabs(groupName);
            return tabs.length;
        };

        service.selectTab = function (groupName, tabId) {
            //console.log('service.selectTab("' + groupName + '","' + tabId + '")');
            var tab = null;
            var tabs = service.getTabs(groupName);
            for (var i = 0; i < tabs.length; ++i) {
                if (tabs[i].tabId === tabId) {
                    if (!tabs[i].isSelected) { tabs[i].isSelected = true; }
                    tab = tabs[i];
                } else {
                    if(tabs[i].isSelected) tabs[i].isSelected = false;
                }
            }
            return tab;
        };

        service.getTabPanel = function() {
            return $(".nav-tabs3 > .tab-content > .tab-pane");
        };

        //service.closePage = function(uiSref) {
        //    var toPage = null;
        //    var nearPage = null;

        //    if (_tabs.length === 1) {
        //        return false;
        //    }
        //    var opened = 0;
        //    for (var i = 0; i < _tabs.length; ++i) {
        //        if (_tabs[i] && _tabs[i].pageUri === pageUri) {
        //            toPage = _tabs[i];
        //            nearPage = i === 0 ? _tabs[1] : _tabs[i - 1];
        //        }

        //        if (_tabs[i] && _tabs[i].isClosed === false) {
        //            ++opened;
        //        }
        //    }

        //    if (opened === 1) {
        //        return false;
        //    }

        //    if (!toPage) {
        //        return false;
        //    }

        //    toPage.isClosed = true;
        //    if (_isSelected(toPage.pageUri)) {
        //        _currentPage = nearPage;
        //        _selectPage(_currentPage.pageUri);
        //    }
        //}

        //function _getPages() {
        //    var pages = [];

        //    if (arguments.length == 0) {
        //        return _tabs;
        //    }

        //    for (var i = 0; i < arguments.length; ++i) {
        //        pages.push(_getPage(arguments[i]));
        //    }

        //    return pages;
        //}

        //function _getPage(pageUri) {
        //    for (var i = 0; i < _tabs.length; ++i) {
        //        if (_tabs[i].pageUri === pageUri) {
        //            return _tabs[i];
        //        }
        //    }

        //    return _error404;
        //}

        /*
        var service = this;
        var _tabs = [];
        var _currentPage = null;
        var _defaultPageInfo = {
            id: '',

            isClosed: false,
            isSelected: false,
            isDisabled: false,
            isReadonlied: false,

            pageUri: '/',
            pageTitle: 'Page',
            pageContent: 'Nothing',
            pageOrder: 0,

            controller: null,
            templateUrl: null,

            fnOnRegisted: function (callback) { if ($.isFunction(callback)) callback({ success: true }) },
            fnOnShowing: function (callback) { if ($.isFunction(callback)) callback({ success: true }) },
            fnOnShown: function (callback) { if ($.isFunction(callback)) callback({ success: true }) },
            fnOnClosing: function (callback) { if ($.isFunction(callback)) callback({ success: true }) },
            fnOnClosed: function (callback) { if ($.isFunction(callback)) callback({ success: true }) }
        };
        var _error404 = {};

        for (var i = 0; i < routerTable.length; ++i) {
            var item = routerTable[i];
            if (item.id === 'otherwise') {
                _error404 = $.extend({}, item);
            }
        }

        function _registPage(pageOptions) {
            var page = $.extend({}, _defaultPageInfo, pageOptions);
            if (_currentPage && _currentPage.pageUri === page.pageUri) {
                return false;
            }

            for (var i = 0; i < _tabs.length; ++i) {
                if (_tabs[i] && _tabs[i].pageUri === page.pageUri) {
                    return false;
                }
            }

            _tabs.push(page);
            return page;
        }

        function _isSelected(pageUri) {
            return _currentPage && _currentPage.pageUri === pageUri;
        }

        function _openPage(pageId, params, pageUri) {
            var toPage = null;
            var fromPage = _currentPage;

            if (fromPage && fromPage.pageUri === pageUri) {
                return fromPage;
            }

            for (var i = 0; i < _tabs.length; ++i) {
                if (_tabs[i] && _tabs[i].pageUri === pageUri) {
                    toPage = _tabs[i];
                    break;
                }
            }

            if (!toPage) {
                for (var i = 0; i < routerTable.length; ++i) {
                    var item = routerTable[i];
                    if (item.id === pageId) {
                        toPage = _registPage(item);
                        toPage.pageUri = pageUri;
                        toPage.stateParams = params;
                        break;
                    }
                }
                toPage = toPage || _registPage(_error404) || {};
            } else {
                toPage.pageUri = pageUri;
            }

            toPage.isClosed = false;
            _currentPage = toPage;
            _selectPage(toPage.pageUri);
        }

        function _closePage(pageUri) {
            var toPage = null;
            var nearPage = null;

            if (_tabs.length === 1) {
                return false;
            }
            var opened = 0;
            for (var i = 0; i < _tabs.length; ++i) {
                if (_tabs[i] && _tabs[i].pageUri === pageUri) {
                    toPage = _tabs[i];
                    nearPage = i === 0 ? _tabs[1] : _tabs[i - 1];
                }

                if (_tabs[i] && _tabs[i].isClosed === false) {
                    ++opened;
                }
            }

            if (opened === 1) {
                return false;
            }

            if (!toPage) {
                return false;
            }

            toPage.isClosed = true;
            if (_isSelected(toPage.pageUri)) {
                _currentPage = nearPage;
                _selectPage(_currentPage.pageUri);
            }
        }

        function _getPages() {
            var pages = [];

            if (arguments.length == 0) {
                return _tabs;
            }

            for (var i = 0; i < arguments.length; ++i) {
                pages.push(_getPage(arguments[i]));
            }

            return pages;
        }

        function _getPage(pageUri) {
            for (var i = 0; i < _tabs.length; ++i) {
                if (_tabs[i].pageUri === pageUri) {
                    return _tabs[i];
                }
            }

            return _error404;
        }

        function _selectPage(pageUri) {
            var page = _error404;
            for (var i = 0; i < _tabs.length; ++i) {
                if (_tabs[i].pageUri === pageUri) {
                    page = _tabs[i];
                }
                _tabs[i].isSelected = false;
            }
            page.isSelected = true;
            return page;
        }

        service.RegistPage = _registPage;
        service.IsSelected = _isSelected;
        service.OpenPage = _openPage;
        service.ClosePage = _closePage;
        service.GetPage = _getPage;
        service.GetPages = _getPages;
        service.SelectPage = _selectPage;
        */
    });
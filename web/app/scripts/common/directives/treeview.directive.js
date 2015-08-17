'use strict';

angular.module('chApp.common.directives').directive('treeviewDirective', [function () {
    return {
        restrict: 'A',
        scope: {
        },
        link: function (scope, element, attrs, ctrl) {

            $(element).jstree({
                'core': {
                    'data': [
                        {
                            'text': 'My pictures',
                            'state': {
                                'selected': false
                            }
                        },
                        {
                            'text': 'My videos',
                            'typr': 'group',
                            'state': {
                                'opened': true,
                                'selected': false
                            },
                            'children': [
                                {
                                    'text': 'Video 1',
                                }, {
                                    'text': 'Video 2',
                                }
                            ]
                        },
                        {
                            'text': 'My documents',
                            'typr': 'group',
                            'state': {
                                'selected': false
                            },
                            'children': [
                                {
                                    'text': 'Document 1',
                                }, {
                                    'text': 'Document 2',
                                }
                            ]
                        },
                        {
                            'text': 'Events',
                            'state': {
                                'opened': false,
                                'selected': false
                            }
                        },
                        {
                            'text': 'Messages',
                            'state': {
                                'opened': false,
                                'selected': false
                            }
                        },
                    ]
                },
                "types": {
                    "default": {
                        "icon": "icon icons-shopping-08"
                    },
                    "group": {
                        "icon": "icon icons-text-hierarchy-03"
                    }
                },
                "plugins": ["checkbox", "wholerow", "types"],
            });

        }
    };
}]);
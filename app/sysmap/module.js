"use strict";

angular.module('app.sysmap', ['ui.router']);

angular.module('app.sysmap').config(function ($stateProvider) {

    $stateProvider
        .state('app.sysmap', {
            abstract: true,
            data: {
                title: 'Systemic Map Manager'
            }
        })
        .state('app.sysmap.manager', {
            url: '/sysmap/manager',

            views: {
                "content@app": {
                    controller: 'sysMapCtrl',
                    templateUrl: "app/sysmap/views/sysmap-manager.html"
                }
            },

            data: {
                //title: 'Systemic Map Manager',
                //rootId: 'extra-page'
            }

        })
        .state('app.sysmap.view', {

            url: '/sysmap/view/{sysMapId:int}',

            params: {
                sysMapId: {value: null, squash: true}
            },

            views: {
                "content@app": {
                    controller: 'sysMapViewCtrl',
                    templateUrl: "app/sysmap/views/sysmap-view.html"
                }
            },

            data: {
                title: 'Single Map View',
            },
            resolve: {
                scripts: function (lazyScript) {
                    return lazyScript.register([
                        'build/vendor.ui.js'
                    ])

                }
            }

        })
        .state('app.sysmap.manager.process', {

            url: '/sysmap/manager/process/{processId:int}',

            params: {
                processId: {value: null, squash: true}
            },

            views: {
                "content@app": {
                    controller: 'sysMapCtrl',
                    templateUrl: "app/sysmap/views/sysmap-manager.html"
                }
            },

            data: {
                title: 'Single Map View',
            },
            resolve: {
                scripts: function (lazyScript) {
                    return lazyScript.register([
                        'build/vendor.ui.js'
                    ])

                }
            }

        })
        .state('app.sysmap.addnew', {
            url: '/sysmap/addNew/{processId:int}',

            params: {
                processId: {value: null, squash: true}
            },

            views: {
                "content@app": {
                    controller: 'sysAddNewCtrl as newSysmap',
                    templateUrl: "app/sysmap/views/new-sysmap.html"
                }
            },

            data: {
                title: 'Create Systemic Map',
                //rootId: 'extra-page'
            }

        })
});
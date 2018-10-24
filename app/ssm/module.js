angular.module('app.ssm', ['ui.router']);

angular.module('app.ssm').config(function ($stateProvider) {

    $stateProvider
        .state('app.ssm', {
            abstract: true,
            data: {
                title: 'Systemic Structure Map'
            }
        })
        .state('app.ssm.manager', {
            url: '/ssm/manager',

            views: {
                "content@app": {
                    controller: 'sysStructMapCtrl',
                    templateUrl: "app/ssm/views/sysmap-manager.html"
                }
            },

            data: {
                title: 'Systemic Structure Map Manager'
                //rootId: 'extra-page'
            }

        })
        .state('app.ssm.view', {

            url: '/ssm/view/{sysMapId:int}',

            params: {
                sysMapId: {value: null, squash: true}
            },

            views: {
                "content@app": {
                    controller: 'sysStructMapViewCtrl',
                    templateUrl: "app/ssm/views/sysmap-view.html"
                }
            },

            data: {
                title: 'Single Map View'
            },
            resolve: {
                scripts: function (lazyScript) {
                    return lazyScript.register([
                        'build/vendor.ui.js'
                    ])

                }
            }

        })
        .state('app.ssm.manager.process', {

            url: '/ssm/manager/process/{processId:int}',

            params: {
                processId: {value: null, squash: true}
            },

            views: {
                "content@app": {
                    controller: 'sysStructMapCtrl',
                    templateUrl: "app/ssm/views/sysmap-manager.html"
                }
            },

            data: {
                title: 'Single Map View'
            },
            resolve: {
                scripts: function (lazyScript) {
                    return lazyScript.register([
                        'build/vendor.ui.js'
                    ])

                }
            }

        })
        .state('app.ssm.addnew', {
            url: '/ssm/addNew/{processId:int}',

            params: {
                processId: {value: null, squash: true}
            },

            views: {
                "content@app": {
                    controller: 'sysStructAddNewCtrl as newSysmap',
                    templateUrl: "app/ssm/views/new-sysmap.html"
                }
            },

            data: {
                title: 'Create Systemic Structure Map'
                //rootId: 'extra-page'
            }

        })
});
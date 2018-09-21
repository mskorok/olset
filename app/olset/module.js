angular.module('app.olset', ['ui.router']);

angular.module('app.olset').config(function ($stateProvider) {

    $stateProvider
        .state('app.olset', {
            abstract: true,
            data: {
                title: 'OLSET Create Wizard'
            }
        })
        .state('app.olset.create', {
            url: '/olset/create',

            views: {
                "content@app": {
                    controller: 'olsetCreateCtrl',
                    templateUrl: "app/olset/views/create-wizard.html"
                }
            },
            data: {
                //title: '',
                //rootId: 'extra-page'
            }

        })
        .state('app.olset.edit', {

            url: '/olset/edit/{processId:int}',

            views: {
                "content@app": {
                    controller: 'olsetEditCtrl',
                    templateUrl: "app/olset/views/edit-wizard.html"
                }
            },
            data: {
                //title: '',
                //rootId: 'extra-page'
            }

        })
        .state('app.olset.index', {
            url: '/olset/index',
            views: {
                "content@app": {
                    controller: 'olsetIndexCtrl',
                    templateUrl: "app/olset/views/olset-index.html"
                }
            },
            data: {
                //title: '',
                //rootId: 'extra-page'
            }
        })
        .state('app.olset.steps', {

            url: '/olset/steps/{processId:int}',

            params: {
                processId: {value: null, squash: true}
            },
            views: {
                "content@app": {
                    controller: 'olsetStepsCtrl',
                    templateUrl: "app/olset/views/olset-steps.html"
                }
            },
            data: {
                title: 'Process steps'
            },
            resolve: {
                scripts: function (lazyScript) {
                    return lazyScript.register([
                        'build/vendor.ui.js'
                    ])

                }
            }

        })
        .state('app.olset.flow', {

            url: '/olset/flow/{processId:int}',

            params: {
                processId: {value: null, squash: true}
            },
            views: {
                "content@app": {
                    controller: 'olsetFlowCtrl',
                    templateUrl: "app/olset/views/olset-flow.html"
                }
            },
            data: {
                title: 'Process flow'
            },
            resolve: {
                scripts: function (lazyScript) {
                    return lazyScript.register([
                        'build/vendor.ui.js',
                        'node_modules/@ckeditor/ckeditor5-build-classic/build/ckeditor.js'
                    ])

                }
            }

        })
        .state('app.olset.process', {

            url: '/olset/process/{processId:int}',

            params: {
                processId: {value: null, squash: true}
            },
            views: {
                "content@app": {
                    controller: 'olsetProcessCtrl',
                    templateUrl: "app/olset/views/olset-process.html"
                }
            },
            data: {
                title: 'Process flow'
            },
            resolve: {
                scripts: function (lazyScript) {
                    return lazyScript.register([
                        'build/vendor.ui.js',
                        'node_modules/@ckeditor/ckeditor5-build-classic/build/ckeditor.js'
                    ])

                }
            }

        })
        .state('app.olset.evaluation', {

            url: '/olset/evaluation/{evaluationId:int}',

            views: {
                "content@app": {
                    controller: 'olsetEvaluationCtrl',
                    templateUrl: "app/olset/views/olset-evaluation.html"
                }
            }
        })
        .state('app.olset.evaluation.list', {

            url: '/olset/evaluation/list/{evaluationId:int}',

            views: {
                "content@app": {
                    controller: 'olsetEvaluationCtrl',
                    templateUrl: "app/olset/views/olset-evaluation-list.html"
                }
            }
        })
        .state('app.olset.oms', {

            url: '/olset/oms',

            views: {
                "content@app": {
                    controller: 'olsetOmsCtrl',
                    templateUrl: "app/olset/views/olset-oms.html"
                }
            }
        })
        .state('app.olset.csa', {

            url: '/olset/csa',

            views: {
                "content@app": {
                    controller: 'olsetCsaCtrl',
                    templateUrl: "app/olset/views/olset-csa.html"
                }
            }
        })
});
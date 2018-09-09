angular.module('app.surveys', ['ui.router']);

angular.module('app.surveys').config(function ($stateProvider) {

    $stateProvider
        .state('app.surveys', {
            abstract: true,
            data: {
                title: 'Surveys'
            }
        })
        .state('app.surveys.manager', {
            url: '/surveys/manager',

            views: {
                "content@app": {
                    controller: 'surveysCtrl',
                    templateUrl: "app/surveys/views/surveys-manager.html"
                }
            },

            data: {
                title: 'Surveys'
                //rootId: 'extra-page'
            }

        })
        .state('app.surveys.view', {

            url: '/survey/view/{surveyId:int}',

            params: {
                surveyId: {value: null, squash: true}
            },
            views: {
                "content@app": {
                    controller: 'surveysViewCtrl',
                    templateUrl: "app/surveys/views/surveys-view.html"
                }
            },
            data: {
                title: 'Single Survey'
            },
            resolve: {
                scripts: function (lazyScript) {
                    return lazyScript.register([
                        'build/vendor.ui.js'
                    ])

                }
            }

        })
});
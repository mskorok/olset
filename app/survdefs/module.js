angular.module('app.survdefs', ['ui.router']);

angular.module('app.survdefs').config(function ($stateProvider) {

    $stateProvider
        .state('app.survdefs', {
            abstract: true,
            data: {
                title: 'Survey Definitions'
            }
        })
        .state('app.surveyDefinitions.manager', {
            url: '/survdefs/manager',

            views: {
                "content@app": {
                    controller: 'survdefsCtrl',
                    templateUrl: "app/survdefs/views/survdefs-manager.html"
                }
            },

            data: {
                title: 'Survey Definitions Manager'
                //rootId: 'extra-page'
            }

        })
});
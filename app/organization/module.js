angular.module('app.organization', ['ui.router']);

angular.module('app.organization').config(function ($stateProvider) {

    $stateProvider
        .state('app.organization', {
            abstract: true,
            data: {
                title: 'Organization'
            }
        })
        .state('app.organization.manage', {
            url: '/organization',

            views: {
                "content@app": {
                    controller: 'organizationCtrl',
                    templateUrl: "app/organization/views/organization-manager.html"
                }
            },
            data: {
                title: 'Organization'
                //rootId: 'extra-page'
            }

        })
});
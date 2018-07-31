"use strict";

angular.module('app.groups', [ 'ui.router' ]);

angular.module('app.groups').config(function ($stateProvider) {

    $stateProvider
    .state('app.groups', {
        abstract: true,
        data: {
            title: 'Groups'
            }
        })
    .state('app.groups.manager', {
        url: '/groups/manager',

        views: {
            "content@app": {
	            controller: 'groupsCtrl',
                templateUrl: "app/groups/views/groups-manager.html"
            }
        },
        
        data: {
            //title: '',
            //rootId: 'extra-page'
        }

    })
});
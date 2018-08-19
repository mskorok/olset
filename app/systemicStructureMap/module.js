"use strict";

angular.module('app.systemicStructureMap', [ 'ui.router' ]);

angular.module('app.systemicStructureMap').config(function ($stateProvider) {

    $stateProvider
    .state('app.systemicStructureMap', {
        abstract: true,
        data: {
            title: 'Systemic Structure Map'
            }
    })
    .state('app.systemicStructureMap.manager', {
        url: '/systemicStructureMap/manager/{processId:int}',
        views: {
            "content@app": {
	            controller: 'systemicStructureMapManageCtrl',
                templateUrl: "app/systemicStructureMap/views/systemicStructureMap-manager.html"
            }
        },
        data: {
            title: 'Systemic Action Map Manager'
        }
    })
    .state('app.systemicStructureMap.view', {
        url: '/systemicStructureMap/view/{systemicStructureMapId:int}',
        params: { 
		    surveyId: {value: null, squash: true}
		},
        views: {
            "content@app": {
	            controller: 'systemicStructureMapViewCtrl',
                templateUrl: "app/systemicStructureMap/views/systemicStructureMap-view.html"
            }
        },
        data: {
           	title: 'Single Systemic Structure Map',
        },
        resolve: {
            scripts: function(lazyScript){
                return lazyScript.register([
                    'build/vendor.ui.js'
                ])
            }
        }

    })
});
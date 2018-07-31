"use strict";

angular.module('app.survdefs', [ 'ui.router' ]);

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
            //title: '',
            //rootId: 'extra-page'
        }

    })
   /* .state('app.sysmap.view', {
	    
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
            title: 'Systemic Map Simple Map View',
        },
        resolve: {
            srcipts: function(lazyScript){
                return lazyScript.register([
                    'build/vendor.ui.js'
                ])

            }
        }

    })
    .state('app.sysmap.addnew', {
        url: '/sysmap/addNew',

        views: {
            "content@app": {
	            controller: 'sysAddNewCtrl as newSysmap',
                templateUrl: "app/sysmap/views/new-sysmap.html"
            }
        },
        
        data: {
            title: 'Users Manager',
            //rootId: 'extra-page'
        }

    })
        
	       
	       
	                   views: {
                "content@app": {
                    templateUrl: "app/tables/views/normal.html"

                }
            }
	       
	       
	       .state('app.users.manager', {
            url: '/users',
            data: {
                title: 'Users Manager'
            }
            views: {
                "content@app": {
                    controller: 'usrCtrl',
                    templateUrl: "app/users/views/users-manager.html"
                }
            }
        })*/


        /*.state('app.tables.datatables', {
            url: '/tables/datatables',
            data: {
                title: 'Data Tables'
            },
            views: {
                "content@app": {
                    controller: 'DatatablesCtrl as datatables',
                    templateUrl: "app/tables/views/datatables.html"
                }
            }
        })*/
});
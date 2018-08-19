"use strict";

angular.module('app.departments', [ 'ui.router' ]);

angular.module('app.departments').config(function ($stateProvider) {

    $stateProvider
    .state('app.departments', {
        abstract: true,
        data: {
            title: 'Departments'
            }
        })
    .state('app.departments.manager', {
        url: '/departments/manager',

        views: {
            "content@app": {
	            controller: 'departmentsCtrl',
                templateUrl: "app/departments/views/departments-manager.html"
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
            scripts: function(lazyScript){
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
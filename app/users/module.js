"use strict";

angular.module('app.users', [ 'ui.router' ]);

angular.module('app.users').config(function ($stateProvider) {

    $stateProvider
    .state('app.users', {
        abstract: true,
        data: {
            title: 'Users'
            }
        })
    .state('app.users.manager', {
        url: '/users/manager',

        views: {
            "content@app": {
	            controller: 'usrManagerCtrl as usertables',
                templateUrl: "app/users/views/users-manager.html"
            }
        },
        
        data: {
            title: 'Users Manager',
            //rootId: 'extra-page'
        }

    })
    .state('app.users.addnew', {
        url: '/users/addNew',

        views: {
            "content@app": {
	            controller: 'usrAddNewCtrl as newuser',
                templateUrl: "app/users/views/new-user.html"
            }
        },
        
        data: {
            title: 'Users Manager',
            //rootId: 'extra-page'
        }

    })
    .state('app.users.edit', {
        url: '/users/edit/{userId:int}',

        views: {
            "content@app": {
                controller: 'usrEditCtrl',
                templateUrl: "app/users/views/edit-user.html"
            }
        },
        data: {
            title: 'Edit User'
        }
    });
       /* 
	       
	       
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
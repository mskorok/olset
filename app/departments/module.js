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
});
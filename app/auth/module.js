angular.module('app.auth', [
    'ui.router'
//        ,
//        'ezfb',
//        'googleplus'
]).config(function ($stateProvider
                    //        , ezfbProvider
                    //        , GooglePlusProvider
) {
//        GooglePlusProvider.init({
//            clientId: authKeys.googleClientId
//        });
//
//        ezfbProvider.setInitParams({
//            appId: authKeys.facebookAppId
//        });
    $stateProvider
        .state('realLogin', {
            url: '/login',

            views: {
                root: {
                    templateUrl: "app/auth/login/login.html",
                    controller: 'LoginCtrl'
                }
            },
            data: {
                title: 'Login',
                rootId: 'extra-page'
            },
            // parent: "app"
            // ,
            // resolve: {
            //     scripts: function(lazyScript){
            //         return lazyScript.register([
            //             'build/vendor.ui.js'
            //         ])
            //
            //     }
            // }

        });
    $stateProvider.state('registration', {
        url: '/register',
        views: {
            root: {
                templateUrl: 'app/auth/views/register.html',
                controller: 'registrationController'
            }
        },
        data: {
            title: 'Register',
            htmlId: 'extr-page'
        }
    }).state('forgotPassword', {
        url: '/forgot-password',
        views: {
            root: {
                templateUrl: 'app/auth/views/forgot-password.html'
            }
        },
        data: {
            title: 'Forgot Password',
            htmlId: 'extr-page'
        },
        // parent: "app"
    })

    /*.state('lock', {
        url: '/lock',
        views: {
            root: {
                templateUrl: 'app/auth/views/lock.html'
            }
        },
        data: {
            title: 'Locked Screen',
            htmlId: 'lock-page'
        }
    })*/


}).constant('authKeys', {
    // googleClientId: '',
    // facebookAppId: ''
});
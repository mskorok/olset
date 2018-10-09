/**
 * @ngdoc overview
 * @name app [smartadminApp]
 * @description
 * # app [smartadminApp]
 *
 * Main module of the application.
 */

angular.module('app', [
    'ngDialog',
    'ngSanitize',
    'ngAnimate',
    'restangular',
    'ui.router',
    'ui.bootstrap',
    'mgo-angular-wizard',
    'textAngular',

    // Smartadmin Angular Common Module
    'SmartAdmin',

    // App
    'app.olset',
    'app.auth',
    'app.layout',
    'app.users',
    'app.sysmap',
    'app.groups',
    'app.departments',
    'app.surveys',
    'app.organization',
    'app.help',
    'app.systemicStructureMap',
    //'app.chat',
    'app.dashboard',
    'app.calendar',
    //'app.inbox',
    'app.graphs',
    'app.tables',
    'app.forms',
    'app.ui',
    'app.widgets',
    'app.maps',
    'app.appViews',
    'app.misc',
    'app.smartAdmin'
    //'app.eCommerce'
])
    .factory('Auth', function ($window) {
        var user;
        var userR = false;

        return {
            setUser: function (aUser) {
                user = aUser;
            },

            setRole: function (rUser) {
                userR = rUser;
            },

            isLoggedIn: function () {
                user = $window.localStorage.getItem('authToken');

                return user ? user : false;
            },

            userHaveRole: function () {
                var uDatas = JSON.parse($window.localStorage.getItem('userData'));
                if (uDatas) {
                    userR = uDatas.role;
                }
                return userR ? userR : false;
            }

        }

    })
    .factory('MainConf', function ($location) {

        var surl;
        var spath;

        return {

            servicesUrl: function () {
                // surl = 'http://144.76.5.203/olsetapp/';//dev
                surl = $location.host() === 'olset.gr'
                    ? 'http://olback.gr/' : 'http://144.76.5.203/olsetapp/';//local
                return surl;
            },

            mainAppPath: function () {

                if ($location.host() === 'localhost' || $location.host() === 'olset.gr') {
                    spath = "/app";
                } else {
                    spath = "/backoffice/app";//dev
                    // spath = "/app";//local
                }

                if (spath == null) {
                    // console.log("Error getting path")
                }

                return spath;
            },

            answer: {
                demographicsCount: 7,
                evaluationCount: 28,
                aarCount: 4,
                CRSCount: 3,
                VSCount: 3
            },

            survey: {
                initial: '_IS_',
                CRS: '_CS_',
                VS: '_VS_',
                evaluation: '_ES_',
                AAR: '_AAR_',
                demographics: '_DS_'
            }
        }
    })
    // .filter('trusted', ['$sce', function ($sce) {
    //     return function(url) {
    //             return $sce.trustAsResourceUrl(url);
    //     };
    // }])
    .config(function ($provide, $httpProvider, RestangularProvider) {

        // console.log('Auth config start');
        // Intercept http calls.
        $provide.factory('ErrorHttpInterceptor', function ($q) {
            var errorCounter = 0;

            function notifyError(rejection) {
                // console.log(rejection);
                $.bigBox({
                    title: rejection.status + ' ' + rejection.statusText,
                    content: rejection.data,
                    color: "#C46A69",
                    icon: "fa fa-warning shake animated",
                    number: ++errorCounter,
                    timeout: 6000
                });
            }

            return {
                // On request failure
                requestError: function (rejection) {
                    // show notification
                    notifyError(rejection);

                    // Return the promise rejection.
                    return $q.reject(rejection);
                },

                // On response failure
                responseError: function (rejection) {
                    // show notification
                    notifyError(rejection);
                    // Return the promise rejection.
                    return $q.reject(rejection);
                }
            };
        });

        // Add the interceptor to the $httpProvider.
        $httpProvider.interceptors.push('ErrorHttpInterceptor');

        RestangularProvider.setBaseUrl(location.pathname.replace(/[^\/]+?$/, ''));

    })
    .constant('APP_CONFIG', window.appConfig)
    .run(function ($rootScope, $state, $stateParams, $window, $location, Auth
        ) {

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;


            $rootScope.$on('$locationChangeStart', function (event) {
                //Pages -- - --//
                //var viewSysMap = '/sysmap/view/';

                //Users
                var manageUsers = '/users/manager';
                var addUser = '/users/addNew';
                //SysMaps
                var manageSysMaps = '/sysmap/manager';
                //Groups
                var manageGroups = '/groups/manager';
                var registerUser = '/register';

                var userRole = Auth.userHaveRole();
                var logPath = $location.path();

                if (!Auth.isLoggedIn()) {

                    // console.log('DENY');
                    if (logPath == addUser) {

                    } else if (logPath == registerUser) {

                    } else {
                        $location.path('/login');
                    }

                }
                else {
                    //Routing Allow by Role
                    // console.log('ALLOW');
                    //$location.path('#/dashboard');
                    switch (userRole) {
                        case "Manager":
                            //(logPath != manageUsers) ? $location.path('/login') : '';
                            // console.log('role:', userRole);
                            break;
                        case "User":
                            // console.log('role:', userRole);
                            break;
                        case "Administrator":
                            // console.log('role:', userRole);
                            break;
                        default:
                            // console.log('role:default');
                    }

                }

            });


        }
    );
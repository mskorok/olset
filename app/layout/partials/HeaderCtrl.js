angular.module('app.layout').controller(
    'HeaderCtrl',
    function ($scope, $window, $state, User, Auth, $location, $rootScope, $http, MainConf, $element) {

        $scope.slug = {
            "slug": null
        };
        //
        // $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
        //     console.log('Current route name: ' + $location.path());
        //     // Get all URL parameter
        //     //console.log($routeParams);
        // });
        //console.log($window.localStorage.getItem('userData'));
        $rootScope.$on('$locationChangeStart', function (event) {

                $scope.slug.slug = $location.path().replace("/", "");
                $scope.slug.slug = $scope.slug.slug.replace(new RegExp('/', 'g'), "_");
                $scope.slug.slug = $scope.slug.slug.replace(/[0-9]/g, '');
                //$scope.slug.slug.split('/')[0]


                $http({
                    method: 'POST',
                    url: MainConf.servicesUrl() + 'survey/addWpHelp',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: $scope.slug

                }).then(function successCallback(response) {
                    console.log('Current route name is: ' + $scope.slug.slug);
                    if (response.data.data.code === 1) {

                        $scope.helpForPage = response.data.data.data;

                        if ($element.data('bs.popover')) {
                            $element.data('bs.popover').options.content = $scope.helpForPage;
                        }
                        //t.data('popover').tip().find('.popover-content').html(r);
                    } else {
                        $scope.helpForPage = "Could not find help for this page.";
                    }

                }, function errorCallback(response) {
                    console.log('error addWpHelp', response);
                    alert('error addWpHelp');
                });

            }
        );

        $scope.$watch(Auth.userHaveRole, function (value, oldValue) {
            console.log('roleValueW: ', value);
            $scope.userRole = value;

            if (value) {
                if (value == 'Manager') {
                    $scope.isManager = true;
                } else if (value == 'User') {
                    $scope.isUser = true;
                } else if (value == 'Administrator') {
                    $scope.isAdmin = true;
                }
                console.log('the val: ', value);
            } else {
                $scope.userRole = false;
            }

        }, true);

        console.log('Layout Role: ', Auth.userHaveRole);

        $scope.userLogout = function () {

            $window.localStorage.removeItem("authToken");
            $window.localStorage.removeItem("userData");

            $state.go('realLogin');

        }
    }
);
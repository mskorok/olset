angular.module('app.layout').controller(
    'HeaderCtrl',
    function ($scope, $window, $state, User, Auth, $location, $rootScope, $http, MainConf, $element, $sce) {

        $scope.slug = {
            "slug": null
        };
        var getInfo = function () {
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
                console.log('success addWpHelper: ', response);
                $scope.helpForPage = '.';
                if (response.data.data.code === 1) {
                    var info_button = document.getElementById('info_popover');
                    if (info_button) {
                        var cont = info_button.closest('span').querySelector('div.popover-content');
                        if (cont) {
                            setTimeout(function () {
                                cont.innerHTML = $sce.trustAsHtml(response.data.data.data);
                            }, 50)

                        }
                        info_button.addEventListener('click', function (ev) {
                            var container = info_button.closest('span').querySelector('div.popover-content');
                            if (container) {
                                setTimeout(function () {
                                    container.innerHTML = $sce.trustAsHtml(response.data.data.data);
                                }, 50)
                            }
                        })
                    }
                } else {
                    $scope.helpForPage = "Could not find help for this page.";
                }

            }, function errorCallback(response) {
                console.log('error addWpHelp', response);
                alert('error addWpHelp');
            });
        };
        

        //
        // $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
        //     console.log('Current route name: ' + $location.path());
        //     // Get all URL parameter
        //     //console.log($routeParams);
        // });
        //console.log($window.localStorage.getItem('userData'));
        getInfo();
        $rootScope.$on('$locationChangeStart', function (event) {
                getInfo();
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
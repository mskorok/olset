angular.module('app.help').controller(
    'helpSubjectCtrl',
    function ($scope, $window, $state, User, Auth, $location, $rootScope, $http, MainConf, $sce) {
        $scope.token = $window.localStorage.getItem('authToken');

        $scope.theSlug = {
            "slug": null
        };
        //
        // $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
        //     console.log('Current route name: ' + $location.path());
        //     // Get all URL parameter
        //     //console.log($routeParams);
        // });
        //console.log($window.localStorage.getItem('userData'));

        $scope.theSlug.slug = $location.path().replace("/", "");
        $scope.theSlug.slug = $scope.theSlug.slug.replace(new RegExp('/', 'g'), "_");

        var helpData = function () {
            $http({
                method: 'POST',
                url: MainConf.servicesUrl() + 'survey/addWpHelp',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: $scope.theSlug

            }).then(function successCallback(response) {
                console.log($scope.theSlug);
                if (response.data.data.code === 1) {

                    $scope.thisCanBeusedInsideNgBindHtml = response.data.data.data;
                    $scope.helpForPageSubject = $sce.trustAsHtml(response.data.data.data);
                    console.log('helpForPageSubject', $scope.helpForPageSubject);
                    //t.data('popover').tip().find('.popover-content').html(r);
                } else {
                    $scope.helpForPageSubject = "Could not find help for this page.";
                }

            }, function errorCallback(response) {
                console.log('Help data error', response);
                alert('Help data error');
            });

            $scope.$apply();
        };

        setTimeout(helpData, 500);

    }
);
angular.module('app.dashboard').controller(
    'DashboardCtrl',
    function ($scope, $http, $window, $stateParams, $document, $state, $timeout, MainConf, Auth) {
        $scope.token = $window.localStorage.getItem('authToken');

        function addTexts(firstProcess) {
            var crs = document.getElementById('crs_text');
            if (crs) {
                crs.innerHTML = firstProcess.CurrentReality;
            }

            var vs = document.getElementById('vs_text');
            if (vs) {
                vs.innerHTML = firstProcess.InitialIntentions;
            }
        }

        var datas2 = function () {

            if (Auth.userHaveRole() == "Manager") {
                $http({
                    method: 'GET',
                    url: MainConf.servicesUrl() + 'statistics/dashboard',
                    headers: {
                        'Authorization': 'Bearer ' + $scope.token,
                        'Content-Type': 'application/json'
                    }

                }).then(function successCallback(response) {
                    console.log('Dashboard data success', response);
                    $scope.olsetStatsInfo = response.data.data.data;
                    $scope.firstProcess = response.data.data.data.process;
                    $scope.isProcess = $scope.firstProcess !== null;
                    addTexts($scope.firstProcess);
                    console.log('dashboard resp', $scope.olsetStatsInfo.count_organizations[0]);

                }, function errorCallback(response) {
                    console.warn('Dashboard data error', response);
                    alert('Dashboard data error');
                    $scope.olsetStatsInfo = response.data.data.data;
                    console.log('data error', $scope.olsetStatsInfo);
                });
            }

            $http({
                method: 'GET',
                url: MainConf.servicesUrl() + 'survey/getAvailableSurveys',
                headers: {
                    'Authorization': 'Bearer ' + $scope.token,
                    'Content-Type': 'application/json'
                }

            }).then(function successCallback(response) {
                console.log('Dashboard getAvailableSurveys data success', response);
                $scope.olsetSurvey = response.data.data.data;
                console.log('user surveys:: ', $scope.olsetSurvey);

            }, function errorCallback(response) {
                console.warn('Dashboard getAvailableSurveys data error', response);
                alert('Dashboard getAvailableSurveys data error');
                $scope.olsetProcessData = response.data.process;
                console.log('error process data ', $scope.olsetProcessData);
            });

            //$scope.$apply();
        };

        datas2();

    }
);
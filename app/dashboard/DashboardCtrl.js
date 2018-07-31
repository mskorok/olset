'use strict';

angular.module('app.dashboard').controller('DashboardCtrl', function ($scope, $http, $window, $stateParams, $document, $state, $timeout, MainConf, Auth) {

    var authToken = $window.localStorage.getItem('authToken');
    $scope.token = authToken;

    var datas2 = function () {

        if (Auth.userHaveRole() == "Manager") {
            $http({
                method: 'GET',
                url: MainConf.servicesUrl() + 'statistics/dashboard',
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                }

            }).then(function successCallback(response) {
                $scope.olsetStatsInfo = response.data.data.data;
                console.log('dashboard resp',$scope.olsetStatsInfo.count_organizations[0]);

            }, function errorCallback(response) {
                $scope.olsetStatsInfo = response.data.data.data;
                //console.log('YOYO');
                //console.log($scope.surveyQuestionData);
            });
        }

        $http({
            method: 'GET',
            url: MainConf.servicesUrl() + 'survey/getAvailableSurveys',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            }

        }).then(function successCallback(response) {
            $scope.olsetSurvey = response.data.data.data;
            console.log('user surveys:: ',$scope.olsetSurvey);

        }, function errorCallback(response) {
            $scope.olsetProcessData = response.data.process;
            //console.log('YOYO');
            //console.log($scope.surveyQuestionData);
        });

        //$scope.$apply();
    }

    datas2();

});
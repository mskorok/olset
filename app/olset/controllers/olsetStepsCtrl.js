/**
 * Created by another_reality on 04/03/2018.
 */
"use strict";

angular.module('app.olset').controller('olsetStepsCtrl', function ($scope, $http, $window, $stateParams, $document, $state, $timeout, MainConf, ngDialog) {

    var authToken = $window.localStorage.getItem('authToken');
    $scope.token = authToken;
    $scope.processId = $stateParams.processId;
    $scope.surveyName = "Survey Items";
    $scope.openModaltoAddOrEdit = function (id, title, currentReality, initialIntentions, modalName) {
        ngDialog.open({
            template: MainConf.mainAppPath() + '/olset/views/edit-olset-process.html',
            scope: $scope
        });
        $scope.olsetData = {
            "id": id,
            "title": title,
            "CurrentReality": currentReality,
            "InitialIntentions": initialIntentions
        }
        $scope.addOrEditTitle = modalName;
    }

    var datas2 = function () {
        $http({
            method: 'GET',
            url: MainConf.servicesUrl() + 'process/' + $scope.processId,
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            }

        }).then(function successCallback(response) {
            $scope.olsetProcessData = response.data.process;
            console.log($scope.olsetProcessData);

        }, function errorCallback(response) {
            $scope.olsetProcessData = response.data.process;
            //console.log('YOYO');
            //console.log($scope.surveyQuestionData);
        });

    }


    datas2();

})
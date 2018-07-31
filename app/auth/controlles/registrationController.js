"use strict";

angular.module('app.auth').controller('registrationController', function ($scope, $http, $window, $stateParams, $document, $state, $timeout, MainConf, ngDialog, $sce) {

    // "firstName":"Thomas55",
    //     "username":"sdfddsf55",
    //     "email":"tshadsatz555@icloud.com",
    //     "password":"fds",
    //     "organization":1

    $scope.organizationData = {
        "name" : null,
        "description" : null
    }
    $scope.userRegistrationData = {
        'firstName' : null,
        'LastName' : null,
        'username' : null,
        "email" : null,
        'password' : null,
        'organization' : null
    }

    $scope.UserRegistration = function() {


        $http({
            method: 'POST',
            url: MainConf.servicesUrl() + 'organization/organization',
            headers: {
                // 'Authorization': 'Bearer '+authToken,
                'Content-Type': 'application/json'
            },
            data: $scope.organizationData
        }).then(function successCallback(response) {
            console.log('organization set::', response);
            $scope.organizationId = response.data.data.userId;
        }, function errorCallback(response) {
            console.warn(response);
        });

        var dataall = {
            "firstName" : $scope.userRegistrationData.firstName,
            "LastName" : $scope.userRegistrationData.LastName,
            "username" : $scope.userRegistrationData.username,
            "email" : $scope.userRegistrationData.email,
            "password" : $scope.userRegistrationData.password,
            "organization" : $scope.organizationId
        }

        var ordata = JSON.stringify(dataall);

        console.log("reqd", $scope.userRegistrationData);
        $http({
            method: 'POST',
            url: MainConf.servicesUrl() + 'users/createManagerPublic',
            headers: {
                // 'Authorization': 'Bearer '+authToken,
                'Content-Type': 'application/json'
            },
            data: ordata
        }).then(function successCallback(response) {
            $scope.theUserId = response.data.data.data.userid;
            console.log("resp", $scope.theUserId);
        }, function errorCallback(response) {
            console.log(response);
        });

    }


})
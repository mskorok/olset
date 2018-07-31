"use strict";
angular.module('app.olset').controller('olsetEditCtrl', function ($scope, $http, $window, $stateParams, $state, $timeout, MainConf, ngDialog) {

    var authToken = $window.localStorage.getItem('authToken');
    $scope.token = authToken;
    $scope.processId = $stateParams.processId;

    $scope.createWizardData = {
        "title": "",
        "CurrentReality": "",
        "InitialIntentions": "",
    }

    $scope.permissionsData = {
        "process": "",
        "organization": false,
        "department": [],
        "persons": []
    }

    var generalProcessInfos = function () {
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

        $http({
            method: 'GET',
            url: MainConf.servicesUrl() + 'users/getProcessPermissions/' + $scope.processId,
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            }

        }).then(function successCallback(response) {
            $scope.permissionsData.persons = response.data.data.data.users;
            $scope.permissionsData.department = response.data.data.data.departments;
            console.log('nnnbbn',$scope.permissionsData.department);

        }, function errorCallback(response) {
            //$scope.olsetProcessData = response.data.process;
            //console.log('YOYO');
            //console.log($scope.surveyQuestionData);
        });
    }

    setTimeout(generalProcessInfos, 1000);

    $scope.toggleDepSelection = function toggleSelection(depsId) {
        var idx = $scope.permissionsData.department.indexOf(depsId);
        // Is currently selected
        if (idx > -1) {
            $scope.permissionsData.department.splice(idx, 1);
        }
        // Is newly selected
        else {
            $scope.permissionsData.department.push(depsId);
        }
    };

    $scope.toggleUserSelection = function toggleSelection(userId) {
        var idx = $scope.permissionsData.persons.indexOf(userId);
        // Is currently selected
        if (idx > -1) {
            $scope.permissionsData.persons.splice(idx, 1);
        }
        // Is newly selected
        else {
            $scope.permissionsData.persons.push(userId);
        }
        console.log("YoloTso:" + $scope.permissionsData.persons);
    };


    $scope.showOverallSelection = function () {

        if ($scope.permissionsData.organization == true) {
            $scope.showUsers = true;
            $scope.showDeps = true;
        } else {
            $scope.permissionsData.organization == true;
        }
    }

    $scope.showUserSelection = function () {
        $scope.showUsers = true;
    }

    $scope.showDepsSelection = function () {
        $scope.showDeps = true;
    }

    $scope.fullOrganization = true;

    var departmentsData1 = function () {
        $http({

            method: 'GET',
            url: MainConf.servicesUrl() + 'department',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            }

        }).then(function successCallback(response) {
            $scope.departmentsData = response.data.data.data;
            console.log("departments data: ", $scope.departmentsData);
        }, function errorCallback(response) {
            return false;
        });
    }
    departmentsData1();

    var usersData1 = function () {
        $http({

            method: 'GET',
            url: MainConf.servicesUrl() + 'users',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            }

        }).then(function successCallback(response) {
            $scope.usersData = response.data.users;
            console.log("user data: ", $scope.usersData);
        }, function errorCallback(response) {

            return false;
        });
    }
    usersData1();

    $scope.departmentsUserData = function (departmentsId) {

        $http({

            method: 'GET',
            url: MainConf.servicesUrl() + 'department',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            }

        }).then(function successCallback(response) {
            return response.data.data.data;
        }, function errorCallback(response) {

            return false;
        });
    }

    //Validation scopes
    $scope.prepareStep = function () {
        $scope.activateErrors = false;
        return true;
    }

    $scope.validateBasicInfo = function () {

        var title = $scope.createWizardData.title;
        var currentReality = $scope.createWizardData.CurrentReality;

        if (title.length == 0) {
            $scope.messageContent = "Please add a title";
            $scope.activateErrors = true;
            return false;
        } else if (currentReality.length == 0) {
            $scope.messageContent = "Please add currentReality";
            $scope.activateErrors = true;
            return false;
        } else {
            $scope.activateErrors = false;
            return true;
        }
    }

    $scope.validateInitialIntention = function () {

        var initialIntentions = $scope.createWizardData.InitialIntentions;

        if (initialIntentions.length == 0) {
            $scope.messageContent = "Please add initial intentions";
            $scope.activateErrors = true;
            return false;
        } else {
            $scope.activateErrors = false;
            return true;
        }
    }

    $scope.validatePermissions = function () {

        return true;
    }

    $scope.wizard1CompleteCallback = function () {

        //if ($scope.activateErrors == false) {

            $http({
                method: 'PUT',
                url: MainConf.servicesUrl() + 'process/' + $scope.processId,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                },
                data: {
                    "title": $scope.olsetProcessData.title,
                    "CurrentReality": $scope.olsetProcessData.CurrentReality,
                    "InitialIntentions": $scope.olsetProcessData.InitialIntentions
                }
            }).then(function successCallback(response) {

                $http({
                    method: 'POST',
                    url: MainConf.servicesUrl() + 'users/setProcessPermissions',
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        "processId": response.data.process.id,
                        "organization": [],
                        "department": $scope.permissionsData.department,
                        "persons": $scope.permissionsData.persons
                    }
                }).then(function successCallback(response) {

                    $.bigBox({
                        title: "Congratulations! OLSET " + $scope.createWizardData.title + " created!",
                        color: "#739E73",
                        timeout: 5000,
                        icon: "fa fa-check",
                        number: "1"
                    });

                    $state.go('app.olset.index');

                    ngDialog.close();

                }, function errorCallback(response) {

                });

            }, function errorCallback(response) {

            });
        //}
    };
})
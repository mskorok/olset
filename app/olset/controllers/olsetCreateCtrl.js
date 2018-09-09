angular.module('app.olset').controller(
    'olsetCreateCtrl',
    function ($scope, $http, $window, $stateParams, $state, $timeout, MainConf, ngDialog) {

        var authToken = $window.localStorage.getItem('authToken');
        $scope.token = authToken;

        $scope.createWizardData = {
            "title": "",
            "CurrentReality": "",
            "InitialIntentions": ""
        };

        $scope.permissionsData = {
            "process": "",
            "organization": false,
            "department": [],
            "persons": []
        };

        // Toggle selection for a given fruit by name
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

        // Toggle selection for a given fruit by name
        $scope.toggleUserSelection = function toggleSelection(userId) {
            var idx = $scope.permissionsData.persons.indexOf(userId);
            console.log("YoloTso:" + $scope.permissionsData.persons);
            // Is currently selected
            if (idx > -1) {
                $scope.permissionsData.persons.splice(idx, 1);
            }
            // Is newly selected
            else {
                $scope.permissionsData.persons.push(userId);
            }
        };

        console.log("Organization: " + $scope.permissionsData.organization);

        $scope.showOverallSelection = function () {

            console.log("Organization: " + $scope.permissionsData.organization);

            if ($scope.permissionsData.organization === true) {
                $scope.showUsers = true;
                $scope.showDeps = true;
            } else {
                $scope.permissionsData.organization = true;
            }
        };

        $scope.showUserSelection = function () {
            $scope.showUsers = true;
        };

        $scope.showDepsSelection = function () {
            $scope.showDeps = true;
        };

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
            }, function errorCallback(response) {
                console.log('Olset department data error', response);
                return false;
            });
        };
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
            }, function errorCallback(response) {
                console.log('Olset user data error', response);
                return false;
            });
        };
        usersData1();

        $scope.departmentsUserData = function (departmentsId) {

            $http({

                method: 'GET',
                url: MainConf.servicesUrl() + 'department/' + departmentsId,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                }

            }).then(function successCallback(response) {
                return response.data.data.data;
            }, function errorCallback(response) {
                console.log('Olset department user data error', response);
                return false;
            });
        };

        //Validation scopes
        $scope.prepareStep = function () {
            $scope.activateErrors = false;
            return true;
        }
        ;
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
        };

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
        };

        $scope.validatePermissions = function () {

            return true;
        };

        $scope.wizard1CompleteCallback = function () {

            if ($scope.activateErrors == false) {

                $http({
                    method: 'POST',
                    url: MainConf.servicesUrl() + 'process',
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        "title": $scope.createWizardData.title,
                        "CurrentReality": $scope.createWizardData.CurrentReality,
                        "InitialIntentions": $scope.createWizardData.InitialIntentions
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
                    }).then(function successCallback(response1) {
                        console.log('Olset wizard1CompleteCallback response1', response1);
                        $http({

                            method: 'GET',
                            url: MainConf.servicesUrl() + 'survey/initProcess/' + response.data.process.id,
                            headers: {
                                'Authorization': 'Bearer ' + authToken,
                                'Content-Type': 'application/json'
                            }

                        }).then(function successCallback(response) {
                            console.log('Olset wizard1CompleteCallback data success', response);
                            $.bigBox({
                                title: "Congratulations! OLSET " + $scope.createWizardData.title + " created!",
                                color: "#739E73",
                                timeout: 5000,
                                icon: "fa fa-check",
                                number: "1"
                            });
                        }, function errorCallback(response) {
                            console.log('Olset wizard1CompleteCallback data error 0', response);
                            alert('Olset wizard1CompleteCallback data error 0');
                            return false;
                        });

                        $state.go('app.olset.index');

                        ngDialog.close();

                    }, function errorCallback(response) {
                        console.log('Olset wizard1CompleteCallback data error 1', response);
                        alert('Olset wizard1CompleteCallback data error 1');
                    });

                }, function errorCallback(response) {
                    console.log('Olset wizard1CompleteCallback data error 2', response);
                    alert('Olset wizard1CompleteCallback data error 2');
                });
            }
        };
    }
);
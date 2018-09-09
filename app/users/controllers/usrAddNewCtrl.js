angular.module('app.users').controller('usrAddNewCtrl', function (MainConf, $scope, $http, $window, $state) {

    var authToken = $window.localStorage.getItem('authToken');
    $scope.token = authToken;
    $scope.theUserId = null;
    $scope.userRegistrationData = {
        'firstName': '',
        'lastName': '',
        'username': '',
        'email': '',
        'department': [],
        'role': '',
        'password': ''
    };

    $scope.getDepartment = function (depID) {
        var idx = $scope.userRegistrationData.department.indexOf(depID);
        if (idx > -1) {
            $scope.userRegistrationData.department.splice(idx, 1);
        }
        else {
            $scope.userRegistrationData.department.push(depID);
        }
        console.log('registrationData: ', $scope.userRegistrationData.department);
    };

    $scope.UserRegistration = function () {

        var data_all = {
            "firstName": $scope.userRegistrationData.firstName,
            "username": $scope.userRegistrationData.username,
            "email": $scope.userRegistrationData.email,
            "LastName": $scope.userRegistrationData.lastName,
            "password": $scope.userRegistrationData.password
        };

        var org_data = JSON.stringify(data_all);

        var authToken = $window.localStorage.getItem('authToken');
        console.log(authToken);
        if ($scope.userRegistrationData.role === 'manager') {

            console.log('user role: ', $scope.userRegistrationData);
            $http({
                method: 'POST',
                url: MainConf.servicesUrl() + 'users/createManager',
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                },
                data: org_data
            }).then(function successCallback(response) {
                console.log('Users createManager data success', response);
                $scope.theUserId = response.data.data.data.userid;
                console.log("resp", $scope.theUserId);
            }, function errorCallback(response) {
                console.warn('Users createManager data error', response);
                alert('Users createManager data error');
            });

        } else if ($scope.userRegistrationData.role === 'user') {

            $http({
                method: 'POST',
                url: MainConf.servicesUrl() + 'users/createUser',
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                },
                data: org_data
            }).then(function successCallback(response) {
                console.log('Users createUser data success', response);
                $scope.theUserId = response.data.data.data.userid;
            }, function errorCallback(response) {
                console.warn('Users createUser data error', response);
                alert('Users createUser data error');
            });

        } else {
            alert('Please select a role');
        }

        var addToDepartment = function () {
            if ($scope.theUserId != null) {
                $http({
                    method: 'POST',
                    url: MainConf.servicesUrl() + 'department/assignUserDepartment/' + $scope.theUserId,
                    //data: "message=" + message,
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                        'Content-Type': 'application/json'
                    },
                    data: $scope.userRegistrationData.department
                }).then(function successCallback(response) {
                    console.log('Users assignUserDepartment data success', response);
                }, function errorCallback(response) {
                    console.warn('Users assignUserDepartment data error', response);
                    alert('Users assignUserDepartment data error');
                });
            }
        };

        setTimeout(addToDepartment, 1000);
    };

    var departmentsData1 = function () {
        $http({

            method: 'GET',
            url: MainConf.servicesUrl() + 'department',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            }

        }).then(function successCallback(response) {
            console.log('Users department data success', response);
            $scope.departmentData = response.data.data.data;
        }, function errorCallback(response) {
            console.warn('Users department data error', response);
            alert('Users department data error');
            return false;
        });
    };
    departmentsData1();
});
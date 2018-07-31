angular.module('app.users').controller('usrEditCtrl', function (MainConf, $scope, $http, $stateParams, $window, $state) {

    var authToken = $window.localStorage.getItem('authToken');
    $scope.token = authToken;
    $scope.theUserId = 	$stateParams.userId;
    $scope.userRegistrationData = {
        'firstName' : '',
        'lastName' : ''
    }
    $scope.userDepartment = {
        'department' : []
    }
    var getUserDepartment = function () {
        $http({
            method: 'GET',
            url: MainConf.servicesUrl() + 'department/getUserDepartments/' + $scope.theUserId,
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            }

        }).then(function successCallback(response) {
            $scope.userDepartment.department = response.data.data.data;
            console.log("depaaaa", response);
        }, function errorCallback(response) {
            return false;
        });
    }
    getUserDepartment();
    $scope.userUpdate = function() {

        var dataall = {
            "firstName":$scope.userRegistrationData.firstName,
            "username":$scope.userRegistrationData.username
        }

        var ordata = JSON.stringify(dataall);

        var authToken = $window.localStorage.getItem('authToken');
        console.log(authToken);

        $http({
            method: 'POST',
            url: MainConf.servicesUrl() + 'users/updateOtherUser/' + $scope.theUserId,
            headers: {
                'Authorization': 'Bearer '+authToken,
                'Content-Type': 'application/json'
            },
            data: ordata
        }).then(function successCallback(response) {
            console.log("resp", $scope.theUserId);
        }, function errorCallback(response) {
            console.log(response);
        });

        var addToDepartment = function () {
            if ($scope.theUserId != null) {
                $http({
                    method: 'POST',
                    url: MainConf.servicesUrl() + 'department/updateUserDepartments/' + $scope.theUserId,
                    //data: "message=" + message,
                    headers: {
                        'Authorization': 'Bearer '+authToken,
                        'Content-Type': 'application/json'
                    },
                    data: $scope.userDepartment
                }).then(function successCallback(response) {
                    console.log('depSet:', response);
                }, function errorCallback(response) {
                    console.warn(response);
                });
            }
        }

        setTimeout(addToDepartment,1000);
    }

    $scope.getDepartment = function (depID) {
        var idx = $scope.userDepartment.department.indexOf(depID);
        if (idx > -1) {
            $scope.userDepartment.department.splice(idx, 1);
        }
        else {
            $scope.userDepartment.department.push(depID);
        }
        console.log('registrationData: ',$scope.userDepartment.department);
    }

    var departmentsData1 = function () {
        $http({

            method: 'GET',
            url: MainConf.servicesUrl() + 'department',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            }

        }).then(function successCallback(response) {
            $scope.departmentData = response.data.data.data;
            console.log("dep", $scope.departmentData);
        }, function errorCallback(response) {
            return false;
        });
    }
    departmentsData1();


})
angular.module('app.users').controller(
    'usrEditCtrl',
    function (MainConf, $scope, $http, $stateParams, $window, $state) {

        var authToken = $window.localStorage.getItem('authToken');
        $scope.token = authToken;
        $scope.theUserId = $stateParams.userId;
        $scope.userRegistrationData = {
            'firstName': '',
            'lastName': ''
        };
        $scope.userDepartment = {
            'department': []
        };
        var getUserDepartment = function () {
            $http({
                method: 'GET',
                url: MainConf.servicesUrl() + 'department/getUserDepartments/' + $scope.theUserId,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                }

            }).then(function successCallback(response) {
                console.log('Users getUserDepartments data success', response);
                $scope.userDepartment.department = response.data.data.data;
            }, function errorCallback(response) {
                console.warn('Users getUserDepartments data error', response);
                alert('Users getUserDepartments data error');
                return false;
            });
        };
        getUserDepartment();
        $scope.userUpdate = function () {

            var data_all = {
                "firstName": $scope.userRegistrationData.firstName,
                "username": $scope.userRegistrationData.username
            };

            var org_data = JSON.stringify(data_all);

            var authToken = $window.localStorage.getItem('authToken');
            console.log('authToken', authToken);

            $http({
                method: 'POST',
                url: MainConf.servicesUrl() + 'users/updateOtherUser/' + $scope.theUserId,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                },
                data: org_data
            }).then(function successCallback(response) {
                console.log('Users updateOtherUser data success', response);
            }, function errorCallback(response) {
                console.warn('Users updateOtherUser data error', response);
                alert('Users updateOtherUser data error');
            });

            var addToDepartment = function () {
                if ($scope.theUserId != null) {
                    $http({
                        method: 'POST',
                        url: MainConf.servicesUrl() + 'department/updateUserDepartments/' + $scope.theUserId,
                        //data: "message=" + message,
                        headers: {
                            'Authorization': 'Bearer ' + authToken,
                            'Content-Type': 'application/json'
                        },
                        data: $scope.userDepartment
                    }).then(function successCallback(response) {
                        console.log('Users updateUserDepartments data success', response);
                    }, function errorCallback(response) {
                        console.warn('Users updateUserDepartments data error', response);
                        alert('Users updateUserDepartments data error');
                    });
                }
            };

            setTimeout(addToDepartment, 1000);
        };

        $scope.getDepartment = function (depID) {
            var idx = $scope.userDepartment.department.indexOf(depID);
            if (idx > -1) {
                $scope.userDepartment.department.splice(idx, 1);
            }
            else {
                $scope.userDepartment.department.push(depID);
            }
            console.log('registrationData: ', $scope.userDepartment.department);
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
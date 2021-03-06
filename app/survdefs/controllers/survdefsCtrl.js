angular.module('app.survdefs').controller(
    'survdefsCtrl',
    function ($scope, $http, $window, $stateParams, $state, $timeout, MainConf) {

        var authToken = $window.localStorage.getItem('authToken');
        $scope.token = authToken;

        var datas2 = function () {
            $http({
                method: 'GET',
                url: MainConf.servicesUrl() + 'department',
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                }

            }).then(function successCallback(response) {
                console.log('Survey Definitions department success:', response);
                $scope.departmentsData = response.data.data.data;
            }, function errorCallback(response) {
                console.warn('Survey Definitions department data error', response);
                alert('Survey Definitions department data error');
            });
        };

        datas2();

        $scope.addSurvdefItem = function (title, description) {
            console.log('call');
            $http({
                method: 'POST',
                url: MainConf.servicesUrl() + 'department',
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                },
                data: {
                    'title': title,
                    'description': description
                }

            }).then(function successCallback(response) {
                console.log('Survey Definitions department add success:', response);
                $.bigBox({
                    title: "Department Added!",
                    //content: question + ", just created also a new systemic map Item is here for you just to begin.",
                    color: "#739E73",
                    timeout: 5000,
                    icon: "fa fa-check",
                    number: "1"
                });

                $timeout(function () {
                    datas2();
                    $scope.$apply();
                }, 2);
                //$state.go('app.sysmap.manager.view.'+$scope.sysMapId);
            }, function errorCallback(response) {
                console.warn('Survey Definitions department add data error', response);
                alert('Survey Definitions department add data error');
            });
        };


        $scope.editSurvdefItem = function (id, title, color) {
            $http({
                method: 'PUT',
                url: MainConf.servicesUrl() + 'department' + id,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                },
                data: {
                    'id': id,
                    'title': title,
                    'color': color
                }

            }).then(function successCallback(response) {
                console.log('Survey Definitions department edit success:', response);
                $.bigBox({
                    title: "Group Updated!",
                    color: "#739E73",
                    timeout: 5000,
                    icon: "fa fa-check",
                    number: "1"
                });

                $scope.closedthis = function () {

                    // var des = "sws";
                    /*$.smallBox({
                        title: "Closed!",
                        content: "",
                        color: "#739E73",
                        iconSmall: "fa fa-cloud",
                        timeout: 1000
                    });*/
                };

                $timeout(function () {
                    datas2();
                    //$scope.frameUrl = "http://144.76.5.203/olsetapp/public/sam_view.php?token="
                    // +authToken+"&id="+$scope.sysMapId+"&t="+Date.now()+"";
                    $scope.$apply();
                }, 2);

                // $state.go('app.sysmap.manager.view.'+$scope.sysMapId);
                //$state.go('app.sysmap.manager.view',{"sysMapId": sysmid});

            }, function errorCallback(response) {
                console.warn('Survey Definitions department edit data error', response);
                alert('Survey Definitions department edit data error');
            });

        }


        /*$scope.deleteDepartment = function(grpid) {

            $.SmartMessageBox({
                title: "This move cannot undone!",
                content: "The "+$scope.groupsData.title+" department will be removed, are you sure about that ?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {


                    $http({

                        method: 'DELETE',
                        url: MainConf.servicesUrl()+'department'+grpid,
                        headers: {
                            'Authorization': 'Bearer '+authToken,
                            'Content-Type': 'application/json'
                        }



                    }).then(function successCallback(response) {
                            console.log('Survey Definitions department delete success:', response);
                            var code = response.data.data.code;
                            var title = (code == 1)? "SUCCESS" : "ERROR";
                            var color = (code == 1)? "#739E73" : "#d81e1e";
                            var icon = (code == 1)? "fa fa-check" : "fa fa-exclamation-triangle";

                            //Error Logs
                            $.bigBox({
                                title: title,
                                content: response.data.data.status,
                                color: color,
                                timeout: 15000,
                                icon: icon,
                                number: "1"
                            });

                        $timeout(function() {
                            datas2();
                            $scope.$apply();
                        }, 2);

                    }, function errorCallback(response) {

                        console.warn('Survey Definitions department delete data error', response);
                alert('Survey Definitions department delete data error');

                    });

                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Callback function",
                        content: "<i class='fa fa-clock-o'></i> <i>Good decision...</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }

            });
        }*/
    });
angular.module('app.departments').controller(
    'departmentsCtrl',
    function ($scope, $http, $window, $stateParams, $state, $timeout, MainConf, ngDialog) {

        var authToken = $window.localStorage.getItem('authToken');
        $scope.token = authToken;
        $scope.openModaltoAddOrEdit = function (id, title, description, mode, modalName) {
            ngDialog.open({
                template: MainConf.mainAppPath() + '/departments/views/add-or-edit-view.html',
                scope: $scope
            });
            $scope.groupData = {
                'id': id,
                'title': title,
                'description': description
            };
            $scope.modalMode = mode;
            $scope.addOrEditTitle = modalName;
        };

        var datas2 = function () {
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
                console.log('department error', response);
            });
        };
        datas2();

        $scope.addDepartmentItem = function () {
            $http({

                method: 'POST',
                url: MainConf.servicesUrl() + 'department',
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                },
                data: {
                    'title': $scope.groupData.title,
                    'description': $scope.groupData.description
                }

            }).then(function successCallback(response) {
                ngDialog.close();
                var bmessage = "";
                var bcolor = "";
                if (response.data.data.status == "Error") {
                    bmessage = "Error Adding Department";
                    bcolor = "#d81e1e";
                } else {
                    bmessage = "Department Added!";
                    bcolor = "#739E73";
                }
                $.bigBox({
                    title: bmessage,
                    //content: question + ", just created also a new systemic map Item is here for you just to begin.",
                    color: bcolor,
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
                console.log('Add department data error', response);
                alert('Add department data error');
            });

        };


        $scope.editDepartmentItem = function (id, title, description) {
            $http({

                method: 'PUT',
                url: MainConf.servicesUrl() + 'department/' + id,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                },
                data: {
                    'id': id,
                    'title': title,
                    'description': description
                }

            }).then(function successCallback(response) {
                ngDialog.close();
                $.bigBox({
                    title: "Department Updated!",
                    color: "#739E73",
                    timeout: 5000,
                    icon: "fa fa-check",
                    number: "1"
                });

                $scope.closedthis = function () {//TODO very strange functions, seems its orphan

                    var desde = "swseew";
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
                    //$scope.frameUrl = "http://144.76.5.203/olsetapp/public/sam_view.php?token="+authToken+"&id="
                    // +$scope.sysMapId+"&t="+Date.now()+"";
                    $scope.$apply();
                }, 2);

                // $state.go('app.sysmap.manager.view.'+$scope.sysMapId);
                //$state.go('app.sysmap.manager.view',{"sysMapId": sysmid});

            }, function errorCallback(response) {
                console.log('Edit department data error', response);
                alert('Edit department data error');
            });

        };


        $scope.deleteDepartment = function (grpid) {

            $.SmartMessageBox({
                title: "This move cannot undone!",
                content: "The " + $scope.departmentsData.title +
                " department will be removed, are you sure about that ?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    $http({
                        method: 'DELETE',
                        url: MainConf.servicesUrl() + 'department/' + grpid,
                        headers: {
                            'Authorization': 'Bearer ' + authToken,
                            'Content-Type': 'application/json'
                        }
                    }).then(function successCallback(response) {
                        var code = response.data.data.code;
                        var title = code === 1 ? "SUCCESS" : "ERROR";
                        var color = code === 1 ? "#739E73" : "#d81e1e";
                        var icon = code === 1 ? "fa fa-check" : "fa fa-exclamation-triangle";

                        //Error Logs
                        $.bigBox({
                            title: title,
                            content: response.data.data.status,
                            color: color,
                            timeout: 15000,
                            icon: icon,
                            number: "1"
                        });

                        $timeout(function () {
                            datas2();
                            $scope.$apply();
                        }, 2);

                    }, function errorCallback(response) {
                        console.log('Edit department data error', response);
                        alert('Edit department data error');
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
        }
    }
);
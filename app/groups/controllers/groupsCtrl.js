angular.module('app.groups').controller(
    // angular.module('app.sysmap').controller(
    'groupsCtrl',
    function ($scope, $http, $window, $stateParams, $state, $timeout, MainConf, ngDialog) {

        var authToken = $window.localStorage.getItem('authToken');
        $scope.token = authToken;
        $scope.openModaltoAddOrEdit = function (id, title, color, mode, modalName) {
            ngDialog.open({
                template: MainConf.mainAppPath() + '/groups/views/add-or-edit-view.html',
                scope: $scope
            });
            $scope.groupData = {
                'id': id,
                'title': title,
                'color': color
            };
            $scope.modalMode = mode;
            $scope.addOrEditTitle = modalName;
        };


        var datas2 = function () {
            $http({

                method: 'GET',
                url: MainConf.servicesUrl() + 'group',
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                }

            }).then(function successCallback(response) {
                console.log('SysMap/Groups group data success', response);
                $scope.groupsData = response.data.data.data;
            }, function errorCallback(response) {
                console.warn('SysMap/Groups group data error', response);
                alert('SysMap/Groups group data error');
            });
        };

        datas2();

        $scope.addGroupItem = function () {

            $http({

                method: 'POST',
                url: MainConf.servicesUrl() + 'group/',
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                },
                data: {
                    'title': $scope.groupData.title,
                    'color': $scope.groupData.color
                }

            }).then(function successCallback(response) {
                console.log('SysMap/Groups add group data success', response);
                $scope.groupData.title = "";
                $scope.groupData.color = "";
                ngDialog.close();
                $.bigBox({
                    title: "Group Added!",
                    //content: question + ", just created also a new systemic map Item is here for you just to begin.",
                    color: "#739E73",
                    timeout: 5000,
                    icon: "fa fa-check",
                    number: "1"
                });

                ngDialog.close();

                $timeout(function () {
                    datas2();
                    $scope.$apply();
                }, 2);
                //$state.go('app.sysmap.manager.view.'+$scope.sysMapId);
            }, function errorCallback(response) {
                console.warn('SysMap/Groups add group data error', response);
                alert('SysMap/Groups add group data error');
            });

        };


        $scope.editGroupItem = function (id, title, color) {

            $http({

                method: 'PUT',
                url: MainConf.servicesUrl() + 'group/' + id,
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
                console.log('SysMap/Groups edit group data success', response);
                $.bigBox({
                    title: "Group Updated!",
                    color: "#739E73",
                    timeout: 5000,
                    icon: "fa fa-check",
                    number: "1"
                });
                ngDialog.close();
                $scope.groupData.title = "";
                $scope.groupData.color = "";
                $scope.closedthis = function () {
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

            }, function errorCallback(response) {
                console.warn('SysMap/Groups edit group data error', response);
                alert('SysMap/Groups edit group data error');
            });


            $scope.deleteGroup = function (grpid) {

                $.SmartMessageBox({
                    title: "This move cannot undone!",
                    content: "The " + $scope.groupsData.title + " group will be removed, are you sure about that ?",
                    buttons: '[No][Yes]'
                }, function (ButtonPressed) {
                    if (ButtonPressed === "Yes") {

                        $http({

                            method: 'DELETE',
                            url: MainConf.servicesUrl() + 'group/' + grpid,
                            headers: {
                                'Authorization': 'Bearer ' + authToken,
                                'Content-Type': 'application/json'
                            }

                        }).then(function successCallback(response) {
                            console.log('SysMap/Groups delete group data success', response);
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
                            console.warn('SysMap/Groups delete group data error', response);
                            alert('SysMap/Groups delete group data error');
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
    }
);
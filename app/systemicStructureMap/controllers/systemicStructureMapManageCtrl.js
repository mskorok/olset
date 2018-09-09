angular.module('app.systemicStructureMap').controller(
    'systemicStructureMapManageCtrl',
    function ($scope, $http, $window, $stateParams, $state, $timeout, MainConf, ngDialog) {

        var authToken = $window.localStorage.getItem('authToken');
        $scope.token = authToken;
        $scope.processId = $stateParams.processId;
        $scope.openModaltoAddOrEdit = function (id, name, startDate, endDate, processId, mode, modalName) {
            ngDialog.open({
                template: MainConf.mainAppPath() + '/systemicStructureMap/views/add-or-edit-systemic-structure-map.html',
                scope: $scope
            });
            $scope.sysStructureData = {
                "id": id,
                "name": name,
                "startDate": new Date(startDate),
                "endDate": new Date(endDate),
                "lang": "en",
                "isActive": 1,
                "processId": processId
            };
            $scope.modalMode = mode;
            $scope.addOrEditTitle = modalName;
        };

        var datas2 = function () {
            $http({

                method: 'GET',
                url: MainConf.servicesUrl() + 'systemicmap/getSystemicStructureMap/' + $scope.processId,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                }

            }).then(function successCallback(response) {
                $scope.systemicStructureMapIndex = response.data.data.data;
                console.log('Systemics get successfully', $scope.systemicStructureMapIndex);
            }, function errorCallback(response) {
                console.log('Systemics get data error', response);
                alert('Systemics get data error');
            });
        };

        datas2();

        $scope.addSysStructureMap = function () {

            console.log($scope.sysStructureData);


            $http({
                method: 'POST',
                url: MainConf.servicesUrl() + 'systemicmap/createSystemicStructureMap',
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                },
                data: {
                    "name": $scope.sysStructureData.name,
                    "startDate": $scope.sysStructureData.startDate.toISOString().replace("T", " ").replace("Z", ""),
                    "endDate": $scope.sysStructureData.endDate.toISOString().replace("T", " ").replace("Z", ""),
                    "lang": "gr",
                    "isActive": 1,
                    "processId": $scope.sysStructureData.processId
                }

            }).then(function successCallback(response) {
                console.log('Systemics addSysStructureMap data success', response);
                $.bigBox({
                    title: "Systemic structure map created!",
                    color: "#739E73",
                    timeout: 5000,
                    icon: "fa fa-check",
                    number: "1"
                });
                ngDialog.close();
                setTimeout(function () {
                    datas2();
                    $scope.$apply();
                }, 2);
                //$state.go('app.sysmap.manager.view.'+$scope.sysMapId);
            }, function errorCallback(response) {
                console.log('Systemics addSysStructureMap data error', response);
                alert('Systemics addSysStructureMap data error');
            });
        };

        $scope.editSysStructureMap = function () {
            $http({

                method: 'PUT',
                url: MainConf.servicesUrl() + 'systemicmap/updateSystemicStructureMap/' + $scope.sysStructureData.id,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                },
                data: {
                    "name": $scope.sysStructureData.name,
                    "startDate": $scope.sysStructureData.startDate.toISOString().replace("T", " ").replace("Z", ""),
                    "endDate": $scope.sysStructureData.endDate.toISOString().replace("T", " ").replace("Z", ""),
                    "lang": "gr",
                    "isActive": 1,
                    "processId": $scope.sysStructureData.processId
                }

            }).then(function successCallback(response) {
                console.log('Systemics editSysStructureMap data success', response);
                ngDialog.close();
                $.bigBox({
                    title: "Structure Map Updated!",
                    color: "#739E73",
                    timeout: 5000,
                    icon: "fa fa-check",
                    number: "1"
                });

                $scope.closedthis = function () {//todo strange function

                    // var des = "sws";
                };

                setTimeout(function () {
                    datas2();
                    //$scope.frameUrl = "http://144.76.5.203/olsetapp/public/sam_view.php?token="
                    // +authToken+"&id="+$scope.sysMapId+"&t="+Date.now()+"";
                    $scope.$apply();
                }, 2);

                // $state.go('app.sysmap.manager.view.'+$scope.sysMapId);
                //$state.go('app.sysmap.manager.view',{"sysMapId": sysmid});

            }, function errorCallback(response) {
                console.warn('Systemics editSysStructureMap data error', response);
                alert('Systemics editSysStructureMap data error');
            });
        }
    }
);
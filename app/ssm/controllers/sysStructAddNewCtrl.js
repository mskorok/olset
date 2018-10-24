angular.module('app.ssm').controller(
    'sysStructAddNewCtrl',
    function ($scope, $http, $window, $state, MainConf, $stateParams) {
        var authToken = $window.localStorage.getItem('authToken');
        $scope.token = authToken;
        $scope.processId = $stateParams.processId;

        $scope.sysMapData = {
            'name': '',
            'question': '',
            'proposal': ''
        };

        $scope.urls = {
            'prefix': 'ssm/',
            'create': 'create',
            'createItem': 'createItem'
        };

        $scope.sysStructureMap = function () {
            $http({
                method: 'POST',
                url: MainConf.servicesUrl() + $scope.urls.prefix + $scope.urls.create,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                },
                data: {
                    'processId': $scope.processId,
                    'name': $scope.sysMapData.name,
                    'department': '',
                    'lang': 'en',
                    'isActive': '1'
                }
            }).then(function successCallback(response) {
                console.log('SysStructureMap ssm/create data success', response);
                var sysMapID = Number(response.data.data.data.systemicMapId);
                $http({
                    method: 'POST',
                    url: MainConf.servicesUrl() + $scope.urls.prefix + $scope.urls.createItem,
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        'systemic_map_id': sysMapID,
                        'question': $scope.sysMapData.question,
                        'proposal': $scope.sysMapData.proposal,
                        'from_item': '',
                        'groupId': 10000
                    }
                }).then(function successCallback(response) {
                    console.log('SysStructureMap ssm/createItem data success', response);
                    $.bigBox({
                        title: "Systemic Map Ready!",
                        content: $scope.sysMapData.name + ", just created also a new" +
                        " systemic map Item is here for you just to begin.",
                        color: "#739E73",
                        timeout: 5000,
                        icon: "fa fa-check",
                        number: "1"
                    });
                    $state.go('app.ssm.manager.process', {processId: $scope.processId});
                }, function errorCallback(response) {
                    console.warn('SysMap systemicmap/createItem data error', response);
                    alert('SysStructureMap ssm/createItem data error');
                });
                console.log(response);
            }, function errorCallback(response) {
                console.warn('SysStructureMap ssm/create data error', response);
                alert('SysStructureMap ssm/create data error');
            });
        }
    });
angular.module('app.sysmap').controller(
    'sysAddNewCtrl',
    function ($scope, $http, $window, $state, MainConf, $stateParams) {
        var authToken = $window.localStorage.getItem('authToken');
        $scope.token = authToken;
        $scope.processId = $stateParams.processId;

        $scope.sysMapData = {
            'name': '',
            'question': '',
            'proposal': ''
        };

        $scope.sysMap = function () {
            $http({

                method: 'POST',

                url: MainConf.servicesUrl() + 'systemicmap/create',

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
                console.log('SysMap systemicmap/create data success', response);
                var sysMapID = Number(response.data.data.data.systemicMapId);
                $http({

                    method: 'POST',
                    url: MainConf.servicesUrl() + 'systemicmap/createItem',
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
                    console.log('SysMap systemicmap/createItem data success', response);
                    $.bigBox({
                        title: "Systemic Map Ready!",
                        content: $scope.sysMapData.name + ", just created also a new" +
                        " systemic map Item is here for you just to begin.",
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

                    $state.go('app.sysmap.manager.process', {processId: $scope.processId});
                }, function errorCallback(response) {
                    console.warn('SysMap systemicmap/createItem data error', response);
                    alert('SysMap systemicmap/createItem data error');
                });


                console.log(response);

            }, function errorCallback(response) {
                console.warn('SysMap systemicmap/create data error', response);
                alert('SysMap systemicmap/create data error');
            });
        }
    });
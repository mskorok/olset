angular.module('app.sysmap').controller('sysAddNewCtrl', function ($scope, $http, $window, $state, MainConf, $stateParams) {
    /*
        {
    "name":"Systemic map2  12223",
    "department":"",
    "lang":"en",
    "isActive":"1"
}
    */
    var authToken = $window.localStorage.getItem('authToken');
    $scope.token = authToken;
    $scope.processId = $stateParams.processId;

    $scope.sysMapData = {
        'name': '',
        'question': '',
        'proposal': '',
    }

    $scope.sysMap = function () {

        //console.log($scope.sysMapData.role);


        var ordata = {
            'name': $scope.sysMapData.name,
            'department': '',
            'lang': 'en',
            'isActive': '1'
        }

        var ordata = JSON.stringify(ordata);

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

            //console.log(response.data.data.data.systemicMapId);

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
                    'groupId': 100000
                }

            }).then(function successCallback(response) {

                $.bigBox({
                    title: "Systemic Map Ready!",
                    content: $scope.sysMapData.name + ", just created also a new systemic map Item is here for you just to begin.",
                    color: "#739E73",
                    timeout: 5000,
                    icon: "fa fa-check",
                    number: "1"
                });

                $scope.closedthis = function () {

                    var desde = "swseew";
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

                console.log('YOYO');

            });


            console.log(response);

        }, function errorCallback(response) {

            //console.log('YOYO');

        });

    }


})
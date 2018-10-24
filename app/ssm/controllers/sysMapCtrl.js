angular.module('app.sysmap').controller(
    'sysMapCtrl',
    function ($scope, $http, $window, $state, $timeout, MainConf, $stateParams) {

        var authToken = $window.localStorage.getItem('authToken');
        $scope.timeInMs = 0;
        $scope.processId = $stateParams.processId;

        var datas = function () {
            $http({
                method: 'GET',
                url: MainConf.servicesUrl() + 'systemicmap/getSystemic/' + $scope.processId,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                }

            }).then(function successCallback(response) {
                console.log('SysMap getSystemic data success', response);
                $scope.sysMapData = response.data.data.data;
            }, function errorCallback(response) {
                console.warn('SysMap getSystemic data error', response);
                alert('SysMap getSystemic data error');
                return "error";
            });
        };

        datas();

        $scope.deleteSysmap = function (sysmid) {
            $.SmartMessageBox({
                title: "This move cannot undone!",
                content: "The Systemic Map will be removed, are you sure about that ?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    $http({
                        method: 'DELETE',
                        url: MainConf.servicesUrl() + 'systemicmap/' + sysmid,
                        headers: {
                            'Authorization': 'Bearer ' + authToken,
                            'Content-Type': 'application/json'
                        }
                    }).then(function successCallback(response) {
                        console.log('SysMap systemicmap data success', response);
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

                        datas();
                        $scope.$apply();
                    }, function errorCallback(response) {
                        console.warn('SysMap systemicmap data error', response);
                        alert('SysMap systemicmap data error');
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
        };


        $scope.exportit = function (sysmid, name) {

            $http({

                method: 'POST',
                url: MainConf.servicesUrl() + 'systemicmap/createActionListGroup',
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                },
                data: {
                    'systemicMapId': sysmid,
                    'title': name,
                    'description': 'Action List: ' + name

                }

            }).then(function successCallback(response) {
                console.log('SysMap createActionListGroup data success', response);
                var getItemsIntoArray = function (updatedArr, arr) {

                    //console.log('arr: ', arr);
                    updatedArr.push(
                        {
                            id: arr.id,
                            systemic_map_id: arr.systemic_map_id,
                            question: arr.question,
                            proposa: arr.proposa,
                            groupId: arr.groupId,
                            userId: arr.userId,
                            first_name: arr.first_name,
                            last_name: arr.last_name,
                            color: arr.color,
                            groupTitle: arr.groupTitle
                        }
                    );

                    if (arr.items.length > 0) {
                        getItemsIntoArray(updatedArr, arr.items[0]);
                    }


                };
                var tdatasr = response.data.data.tree;
                var mySpreadSheet = [];
                for (var j = 0; j < tdatasr.length; j++) {
                    var mySheetItems = [];
                    getItemsIntoArray(mySheetItems, tdatasr[j]);
                    mySpreadSheet.push(mySheetItems);
                }

                console.log('myspreedsheet', mySpreadSheet);

                var sheetsCountsAndNames = [];
                for (var i = 0; mySpreadSheet.length > i; i++) {
                    var headOrNot = i === 0;
                    sheetsCountsAndNames.push({
                        sheetid: "Action List " + i,
                        header: headOrNot
                    });
                }

                var data1 = [{a: 1, b: 10}, {a: 2, b: 20}];
                var data2 = [{a: 100, b: 10}, {a: 200, b: 20}];
                var opts = sheetsCountsAndNames;
                console.log(sheetsCountsAndNames);
                var res = alasql(
                    'SELECT * INTO XLSX("' + name + '.xlsx",?) FROM ?',
                    [sheetsCountsAndNames, mySpreadSheet]
                );

                //var arrayToExport = [{id:1, name:"gas"}];
                //var treeDatas = [response.data.data.tree];
                //alasql('SELECT * INTO XLSX("'+name+'.xlsx",{headers:true}) FROM ?', treeDatas);


                $.bigBox({
                    title: "Action List Created",
                    //content: question + ", just created also a new systemic map Item is here for you just to begin.",
                    color: "#739E73",
                    timeout: 5000,
                    icon: "fa fa-check",
                    number: "1"
                });
                //console.log('action list: ',response.data.data);
                //$state.go('app.sysmap.manager.view.'+$scope.sysMapId);

            }, function errorCallback(response) {
                console.warn('SysMap createActionListGroup data error', response);
                alert('SysMap createActionListGroup data error');
            });

        }


    });
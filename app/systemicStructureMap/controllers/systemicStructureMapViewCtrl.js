angular.module('app.systemicStructureMap').controller(
    'systemicStructureMapViewCtrl',
    function ($scope, $http, $window, $stateParams, $document, $state, $timeout, MainConf, ngDialog, $sce) {

        var authToken = $window.localStorage.getItem('authToken');
        $scope.token = authToken;
        $scope.systemicStructureMapId = $stateParams.systemicStructureMapId;
        $scope.surveyName = "Survey Items";
        $scope.openModaltoAddOrEdit = function () {
            $scope.loopData = {
                "name": null,
                "links": []
            };
            var uri = 'systemicmap/getSystemicStructureItem/' + $scope.systemicStructureMapId + '/normal';
            $http({
                method: 'GET',
                url: MainConf.servicesUrl() + uri,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                }
            }).then(function successCallback(response) {
                $scope.normalItemsNodesClear = response.data.data.data.nodes;
                console.log("normal: ", response);
            }, function errorCallback(response) {
                console.log('SSM getSystemicStructureItem data error', response);
                alert('SSM getSystemicStructureItem data error');
            });

            ngDialog.open({
                template: MainConf.mainAppPath() + '/systemicStructureMap/views/add-or-edit-view.html',
                scope: $scope
            });
        };
        $scope.normalItemDatas = [];
        $scope.normalOriginalData = {
            "group": null,
            "groupColor": "",
            "id": null,
            "name": null,
            "proposal": "",
            "systemic_map_id": ""
        };

        $scope.normalItemAction = function (mode, itemData, index) {
            console.log('normalItemAction itemData -> ', itemData);
            if (mode === 'add') {
                $scope.normalItemsNodes.push(angular.copy($scope.normalOriginalData));
            } else if (mode === 'edit') {
                if (itemData.name == null) {
                    alert("please add item name");
                }
                if (itemData.group == null) {
                    alert("please add item name");
                }
                console.log('normalItemAction mode edit verified', itemData);
                var itemNormalToSave = {
                    "systemic_map_id": $scope.systemicStructureMapId,
                    "question": itemData.name,
                    "proposal": "",
                    "groupId": itemData.group,
                    "itemType": "normal"
                };
                if (itemData.id && itemData.name && itemData.group) {
                    editItem(itemNormalToSave, itemData.id);
                } else if (itemData.name != null) {
                    setItem(itemNormalToSave);
                }
            } else if (mode === 'remove') {
                $scope.normalItemsNodes.splice(index, 1);
                if (itemData.id) {
                    $scope.deleteItem(itemData.id);
                }
            }
            console.log('normalItemAction after finish -> ', $scope.normalItemsNodes);
        };

        $scope.dataLinkAhead = {
            "id": null,
            "from_item": null,
            "to_item": null
        };

        var getLinks = function () {
            var uri = 'systemicmap/getStructureChain/' + $scope.systemicStructureMapId + '/normal';
            $http({
                method: 'GET',
                url: MainConf.servicesUrl() + uri,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                }
            }).then(function successCallback(response) {
                $scope.getLinksFromServer = response.data.chain;
                console.log("links: ", $scope.getLinksFromServer);
            }, function errorCallback(response) {
                console.log('SSM getStructureChain data error', response);
                alert('SSM getStructureChain data error');
            });

        };

        setTimeout(getLinks(), 1000);

        $scope.compareLinkElements = function (index, action) {

            if (action === 'from') {
                $scope.toNormalNodes.splice(index, 1);
            }

            if (action === 'to') {
                $scope.fromNormalNodes.splice(index, 1);
            }
        };

        $scope.linkChainCreate = function (mode, itemData, index) {
            console.log('linkChainCreate itemData -> ', itemData);
            if (mode === 'add') {
                $scope.getLinksFromServer.push(angular.copy(itemData));
            } else if (mode == "edit") {
                if (itemData.from_item === null) {
                    alert("please add item from");
                }
                if (itemData.to_item === null) {
                    alert("please add item to");
                }

                setLink(itemData);

            } else if (mode == 'remove') {
                $scope.getLinksFromServer.splice(index, 1);
                if (itemData.id) {
                    $scope.deleteLinkItem(itemData.id);
                }
            }
        };

        $scope.sendLoopData = function (theData) {
            console.log("sendLoopData theData: ", theData);
            var itemNormalToSave = {
                "systemic_map_id": $scope.systemicStructureMapId,
                "question": theData.name,
                "proposal": "",
                "groupId": 0,
                "itemType": "loop"
            };

            $http({
                method: 'POST',
                url: MainConf.servicesUrl() + 'systemicmap/createSystemicStructureMapItem',
                //data: "message=" + message,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                },
                data: itemNormalToSave
            }).then(function successCallback(response) {//todo
                console.log('normal item save:', response);
                // if (dataToSend.itemType == "loop") {
                //     getLoopSystemicMap();
                //     getNormalSystemicMap();
                //     $scope.$apply();
                // }
                $scope.systemicStructureMapItemId = response.data.data.data.systemicStructureMapItemId;
            }, function errorCallback(response) {
                console.warn('SSM createSystemicStructureMapItem data error', response);
                alert('SSM createSystemicStructureMapItem data error');
                console.warn(response);
            });

            if (!theData.links || theData.links.length < 0) {
                alert("Please select items to link");
                return false;
            }

            for (var i = 0; theData.links.length > i; i++) {
                $scope.dataLinkAhead = {
                    "from_item": $scope.systemicStructureMapItemId,
                    "to_item": theData.links[i]
                };
                $http({
                    method: 'POST',
                    url: MainConf.servicesUrl() + 'systemicmap/createStructureChain',
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                        'Content-Type': 'application/json'
                    },
                    data: $scope.dataLinkAhead
                }).then(function successCallback(response) {
                    console.log('SM createStructureChain data success', response);
                    getLinks();
                    $scope.$apply();

                }, function errorCallback(response) {
                    console.warn('SSM createStructureChain data error', response);
                    alert('SSM createStructureChain data error');
                });
            }
            return true;
        };

        $scope.makeLinkConnection = function (loopId, arrayOfItems) {//todo

        };

        var setItem = function (dataToSend) {
            $http({
                method: 'POST',
                url: MainConf.servicesUrl() + 'systemicmap/createSystemicStructureMapItem',
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                },
                data: dataToSend
            }).then(function successCallback(response) {
                console.log('SSM createSystemicStructureMapItem save success:', response);
                if (dataToSend.itemType == "loop") {
                    getLoopSystemicMap();
                    getNormalSystemicMap();
                    $scope.$apply();
                }
            }, function errorCallback(response) {
                console.warn('SSM createSystemicStructureMapItem data error', response);
                alert('SSM createSystemicStructureMapItem data error');
            });
        };

        var setLink = function (dataToSend) {
            console.log('SSM setLink dataToSend:', dataToSend);
            $http({
                method: 'POST',
                url: MainConf.servicesUrl() + 'systemicmap/createStructureChain',
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                },
                data: dataToSend
            }).then(function successCallback(response) {
                console.log('SSM createStructureChain success', response);
                getLinks();
                $scope.$apply();

            }, function errorCallback(response) {
                console.warn('SSM createStructureChain data error', response);
                alert('SSM createStructureChain data error');
            });
        };
        var editItem = function (dataToSend, itemId) {
            $http({
                method: 'PUT',
                url: MainConf.servicesUrl() + 'systemicmap/updateSystemicStructureItem/' + itemId,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                },
                data: {
                    "question": dataToSend.question,
                    "group": dataToSend.group
                }
            }).then(function successCallback(response) {
                console.log('SSM updateSystemicStructureItem success:', response);
                if (dataToSend.itemType === 'loop') {
                    getLoopSystemicMap();
                    getNormalSystemicMap();
                    $scope.$apply();
                }
            }, function errorCallback(response) {
                console.warn('SSM updateSystemicStructureItem data error', response);
                alert('SSM updateSystemicStructureItem data error');
            });
        };

        var getNormalSystemicMap = function () {
            var uri = 'systemicmap/getSystemicStructureItem/' + $scope.systemicStructureMapId + '/normal';
            $http({
                method: 'GET',
                url: MainConf.servicesUrl() + uri,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                }
            }).then(function successCallback(response) {
                $scope.normalItemsNodes = response.data.data.data.nodes;
                $scope.fromNormalNodes = response.data.data.data.nodes;
                $scope.toNormalNodes = response.data.data.data.nodes;
                console.log('SSM getNormalSystemicMap success:', response);
            }, function errorCallback(response) {
                console.warn('SSM getNormalSystemicMap data error', response);
                alert('SSM getNormalSystemicMap data error');
            });

        };

        getNormalSystemicMap();

        var getLoopSystemicMap = function () {
            var uri = 'systemicmap/getSystemicStructureItem/' + $scope.systemicStructureMapId + '/loop';
            $http({
                method: 'GET',
                url: MainConf.servicesUrl() + uri,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                }

            }).then(function successCallback(response) {
                $scope.loopItemsNods = response.data.data.data.nodes;
                console.log('SSM getSystemicStructureItem success:', response);
            }, function errorCallback(response) {
                console.warn('SSM getSystemicStructureItem data error', response);
                alert('SSM getSystemicStructureItem data error');
            });
        };

        getLoopSystemicMap();

        $scope.deleteItem = function (grpid) {
            $.SmartMessageBox({
                title: "Please think twice...",
                content: "The item will be deleted permanently, are you sure about that ?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === 'Yes') {
                    $http({
                        method: 'DELETE',
                        url: MainConf.servicesUrl() + 'systemicmap/deleteSystemicStructureItem/' + grpid,
                        headers: {
                            'Authorization': 'Bearer ' + authToken,
                            'Content-Type': 'application/json'
                        }
                    }).then(function successCallback(response) {
                        console.log('SSM deleteSystemicStructureItem success:', response);
                        var code = response.data.data.code;
                        var title = code === 1 ? "SUCCESS" : "ERROR";
                        var color = code === 1 ? "#739E73" : "#d81e1e";
                        var icon = code === 1 ? "fa fa-check" : "fa fa-exclamation-triangle";
                        //Error Logs
                        $.bigBox({
                            title: title,
                            content: response.data.data.status,
                            color: color,
                            timeout: 3000,
                            icon: icon,
                            number: "1"
                        });
                    }, function errorCallback(response) {
                        console.warn('SSM deleteSystemicStructureItem data error', response);
                        alert('SSM deleteSystemicStructureItem data error');
                    });
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Good decision...",
                        content: "<i class='fa fa-clock-o'></i> <i>Your item is safe yet!</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }

            });

            getLoopSystemicMap();
            //getNormalSystemicMap();
            $scope.$apply();
        };


        $scope.deleteLinkItem = function (grpid) {
            $.SmartMessageBox({
                title: "Please think twice...",
                content: "The link will be deleted permanently, are you sure about that ?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === 'Yes') {
                    $http({
                        method: 'DELETE',
                        url: MainConf.servicesUrl() + 'systemicmap/deleteStructureChain/' + grpid,
                        headers: {
                            'Authorization': 'Bearer ' + authToken,
                            'Content-Type': 'application/json'
                        }
                    }).then(function successCallback(response) {
                        console.log('SSM deleteStructureChain success:', response);
                        var code = response.data.data.code;
                        var title = code === 1 ? "SUCCESS" : "ERROR";
                        var color = code === 1 ? "#739E73" : "#d81e1e";
                        var icon = code === 1 ? "fa fa-check" : "fa fa-exclamation-triangle";
                        //Error Logs
                        $.bigBox({
                            title: title,
                            content: response.data.data.status,
                            color: color,
                            timeout: 3000,
                            icon: icon,
                            number: "1"
                        });
                    }, function errorCallback(response) {
                        console.warn('SSM deleteStructureChain data error', response);
                        alert('SSM deleteStructureChain data error');
                    });
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Good decision...",
                        content: "<i class='fa fa-clock-o'></i> <i>Your item is safe yet!</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }

            });
        };

        $scope.initialGroupOptions = {
            "id": 0,
            "title": "Select Group"
        };
        var getGroups = function () {
            $http({
                method: 'GET',
                url: MainConf.servicesUrl() + 'group',
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                }
            }).then(function successCallback(response) {
                $scope.groupsData = response.data.data.data;
                console.log('SSM group success:', response);
            }, function errorCallback(response) {
                console.warn('SSM group data error', response);
                alert('SSM group data error');
            });
        };

        getGroups();


        var urlSmall = MainConf.servicesUrl() + "public/ssm_view.php";
        var urlBig = MainConf.servicesUrl() + "public/ssm_view.php";

        $scope.frameUrl = $sce.trustAsResourceUrl(urlSmall);
        $scope.frameUrl0 = $sce.trustAsResourceUrl(urlBig);
    }
);
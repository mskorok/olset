"use strict";

angular.module('app.systemicStructureMap').controller('systemicStructureMapViewCtrl', function ($scope, $http, $window, $stateParams, $document, $state, $timeout, MainConf, ngDialog, $sce) {

    var authToken = $window.localStorage.getItem('authToken');
    $scope.token = authToken;
    $scope.systemicStructureMapId = $stateParams.systemicStructureMapId;
    $scope.surveyName = "Survey Items";
    $scope.openModaltoAddOrEdit = function () {
        $scope.loopData = {
            "name":null,
            "links":[]
        }
        $http({
            method: 'GET',
            url: MainConf.servicesUrl() + 'systemicmap/getSystemicStructureItem/' + $scope.systemicStructureMapId + '/normal',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
            $scope.normalItemsNodesClear = response.data.data.data.nodes;
            console.log("normal: ",response);
        }, function errorCallback(response) {
            alert("error_getting_normal");
        });

        ngDialog.open({
            template: MainConf.mainAppPath() + '/systemicStructureMap/views/add-or-edit-view.html',
            scope: $scope
        });
    }
    $scope.normalItemDatas = [];
    $scope.normalOriginalData = {
        "group": null,
        "groupColor": "",
        "id": null,
        "name": null,
        "proposal": "",
        "systemic_map_id": ""
    }

    $scope.normalItemAction = function (mode, itemData, index) {
        console.log('destipezipano -> ', itemData);
        if (mode == "add") {
            $scope.normalItemsNodes.push(angular.copy($scope.normalOriginalData));
        } else if (mode == "edit") {
            if (itemData.name == null) {
                alert("please add item name");
            }
            if (itemData.group == null) {
                alert("please add item name");
            }
            console.log('ghfdskfjsk', itemData);
            var itemNormalToSave = {
                "systemic_map_id": $scope.systemicStructureMapId,
                "question":itemData.name,
                "proposal":"",
                "groupId":itemData.group,
                "itemType":"normal"
            }
            if (itemData.id && itemData.name && itemData.group) {
                editItem(itemNormalToSave, itemData.id);
            } else if (itemData.name != null) {
                setItem(itemNormalToSave);
            }
        } else if (mode == "remove") {
            $scope.normalItemsNodes.splice(index, 1);
            if (itemData.id) {
                $scope.deleteItem(itemData.id);
            }
        }
        console.log('destipezi -> ', $scope.normalItemsNodes);
    }

    $scope.dataLinkAhead = {
        "id": null,
        "from_item":null,
        "to_item":null
    }

    var getLinks = function () {
        $http({
            method: 'GET',
            url: MainConf.servicesUrl() + 'systemicmap/getStructureChain/' + $scope.systemicStructureMapId + '/normal',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
            $scope.getLinksFromServer = response.data.chain;
            console.log("links: ",$scope.getLinksFromServer);
        }, function errorCallback(response) {
            alert("error_getting_normal");
        });

    }

    setTimeout(getLinks(), 1000);

    $scope.compareLinkElements = function (index, action) {

        if (action === 'from') {
            $scope.toNormalNodes.splice(index, 1);
        }

        if (action === 'to') {
            $scope.fromNormalNodes.splice(index, 1);
        }
    }

    $scope.linkChainCreate = function (mode, itemData, index) {
        console.log('destipezilink -> ', itemData);
        if (mode == "add") {
            $scope.getLinksFromServer.push(angular.copy(itemData));
        } else if (mode == "edit") {
            if (itemData.from_item == null) {
                alert("please add item from");
            }
            if (itemData.to_item == null) {
                alert("please add item to");
            }

            setLink(itemData);

        } else if (mode == "remove") {
            $scope.getLinksFromServer.splice(index, 1);
            if (itemData.id) {
                $scope.deleteLinkItem(itemData.id);
            }
        }
    }

    $scope.sendLoopData = function (theData) {
        console.log("loop play: ", theData);
        var itemNormalToSave = {
            "systemic_map_id": $scope.systemicStructureMapId,
            "question":theData.name,
            "proposal":"",
            "groupId":0,
            "itemType":"loop"
        }

        $http({
            method: 'POST',
            url: MainConf.servicesUrl() + 'systemicmap/createSystemicStructureMapItem',
            //data: "message=" + message,
            headers: {
                'Authorization': 'Bearer '+authToken,
                'Content-Type': 'application/json'
            },
            data: itemNormalToSave
        }).then(function successCallback(response) {
            console.log('normal item save:', response);
            // if (dataToSend.itemType == "loop") {
            //     getLoopSystemicMap();
            //     getNormalSystemicMap();
            //     $scope.$apply();
            // }
            $scope.systemicStructureMapItemId = response.data.data.data.systemicStructureMapItemId;
        }, function errorCallback(response) {
            console.warn(response);
        });

        if (!theData.links || theData.links.length < 0) {
            alert("Please select items to link");
            return false;
        }

        for (var i = 0; theData.links.length > i; i++) {
            $scope.dataLinkAhead = {
                "from_item":$scope.systemicStructureMapItemId,
                "to_item":theData.links[i]
            }
            $http({
                method: 'POST',
                url: MainConf.servicesUrl() + 'systemicmap/createStructureChain',
                headers: {
                    'Authorization': 'Bearer '+authToken,
                    'Content-Type': 'application/json'
                },
                data: $scope.dataLinkAhead
            }).then(function successCallback(response) {

                console.log("mpike to link?", response);
                getLinks();
                $scope.$apply();

            }, function errorCallback(response) {
                console.warn(response);
            });
        }
    }

    $scope.makeLinkConnection = function (loopId, arrayOfItems) {

    }

    var setItem = function (dataToSend) {
        $http({
            method: 'POST',
            url: MainConf.servicesUrl() + 'systemicmap/createSystemicStructureMapItem',
            //data: "message=" + message,
            headers: {
                'Authorization': 'Bearer '+authToken,
                'Content-Type': 'application/json'
            },
            data: dataToSend
        }).then(function successCallback(response) {
            console.log('normal item save:', response);
            if (dataToSend.itemType == "loop") {
                getLoopSystemicMap();
                getNormalSystemicMap();
                $scope.$apply();
            }
        }, function errorCallback(response) {
            console.warn(response);
        });
    }

    var setLink = function (dataToSend) {
        console.log("mpike to link?111!!", dataToSend);
        $http({
            method: 'POST',
            url: MainConf.servicesUrl() + 'systemicmap/createStructureChain',
            headers: {
                'Authorization': 'Bearer '+authToken,
                'Content-Type': 'application/json'
            },
            data: dataToSend
        }).then(function successCallback(response) {

            console.log("mpike to link?", response);
            getLinks();
            $scope.$apply();

        }, function errorCallback(response) {
            console.warn(response);
        });
    }
//systemicmap/updateSystemicStructureItem/2
    var editItem = function (dataToSend, itemId) {
        $http({
            method: 'PUT',
            url: MainConf.servicesUrl() + 'systemicmap/updateSystemicStructureItem/'+itemId,
            headers: {
                'Authorization': 'Bearer '+authToken,
                'Content-Type': 'application/json'
            },
            data: {
                "question":dataToSend.question,
                "group":dataToSend.group
            }
        }).then(function successCallback(response) {
            console.log('normal item edit:', response);
            if (dataToSend.itemType == "loop") {
                getLoopSystemicMap();
                getNormalSystemicMap();
                $scope.$apply();
            }
        }, function errorCallback(response) {
            console.warn(response);
        });
    }

    var getNormalSystemicMap = function () {
        $http({
            method: 'GET',
            url: MainConf.servicesUrl() + 'systemicmap/getSystemicStructureItem/' + $scope.systemicStructureMapId + '/normal',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
            $scope.normalItemsNodes = response.data.data.data.nodes;
            $scope.fromNormalNodes = response.data.data.data.nodes;
            $scope.toNormalNodes = response.data.data.data.nodes;
            console.log("normal: ",response);
        }, function errorCallback(response) {
            alert("error_getting_normal");
        });

    }

    getNormalSystemicMap();

    var getLoopSystemicMap = function () {
        $http({
            method: 'GET',
            url: MainConf.servicesUrl() + 'systemicmap/getSystemicStructureItem/' + $scope.systemicStructureMapId + '/loop',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            }

        }).then(function successCallback(response) {
            $scope.loopItemsNods = response.data.data.data.nodes;
            console.log("loop: ",response);
        }, function errorCallback(response) {
            alert("error_getting_loop");
        });
    }

    getLoopSystemicMap();

    $scope.deleteItem = function(grpid) {
        $.SmartMessageBox({
            title: "Please think twice...",
            content: "The item will be deleted permanently, are you sure about that ?",
            buttons: '[No][Yes]'
        }, function (ButtonPressed) {
            if (ButtonPressed === "Yes") {
                $http({
                    method: 'DELETE',
                    url: MainConf.servicesUrl()+'systemicmap/deleteSystemicStructureItem/'+grpid,
                    headers: {
                        'Authorization': 'Bearer '+authToken,
                        'Content-Type': 'application/json'
                    }
                }).then(function successCallback(response) {
                    //console.log("del: ",response);
                    var code = response.data.data.code;
                    var title = (code == 1)? "SUCCESS" : "ERROR";
                    var color = (code == 1)? "#739E73" : "#d81e1e";
                    var icon = (code == 1)? "fa fa-check" : "fa fa-exclamation-triangle";
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
                    alert("an error occured");
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
    }


    $scope.deleteLinkItem = function(grpid) {
        $.SmartMessageBox({
            title: "Please think twice...",
            content: "The link will be deleted permanently, are you sure about that ?",
            buttons: '[No][Yes]'
        }, function (ButtonPressed) {
            if (ButtonPressed === "Yes") {
                $http({
                    method: 'DELETE',
                    url: MainConf.servicesUrl()+'systemicmap/deleteStructureChain/'+grpid,
                    headers: {
                        'Authorization': 'Bearer '+authToken,
                        'Content-Type': 'application/json'
                    }
                }).then(function successCallback(response) {
                    //console.log("del: ",response);
                    var code = response.data.data.code;
                    var title = (code == 1)? "SUCCESS" : "ERROR";
                    var color = (code == 1)? "#739E73" : "#d81e1e";
                    var icon = (code == 1)? "fa fa-check" : "fa fa-exclamation-triangle";
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
                    alert("an error occured");
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
    }

    $scope.initialGroupOptions = {
        "id": 0,
        "title": "Select Group"
    }
    var getGroups = function () {
        $http({
            method: 'GET',
            url: MainConf.servicesUrl()+'group',
            headers: {
                'Authorization': 'Bearer '+authToken,
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
            $scope.groupsData = response.data.data.data;
            console.log("group: ", $scope.groupsData);
        }, function errorCallback(response) {
            alert("cannot_get_groups");
        });
    }

    getGroups();


    var urlSmall = "http://144.76.5.203/olsetapp/public/ssm_view.php";
    var urlBig = "http://144.76.5.203/olsetapp/public/ssm_view.php";

    $scope.frameUrl = $sce.trustAsResourceUrl(urlSmall);
    $scope.frameUrl0 = $sce.trustAsResourceUrl(urlBig);
})
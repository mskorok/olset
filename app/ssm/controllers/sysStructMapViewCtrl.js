angular.module('app.ssm').controller(
    'sysStructMapViewCtrl',
    function ($scope, $http, $window, $stateParams, $document, $state, $sce, $timeout, MainConf) {

        var authToken = $window.localStorage.getItem('authToken');
        $scope.token = authToken;
        $scope.sysMapId = $stateParams.sysMapId;

        $scope.urls = {
            'prefix': 'ssm/',
            'tree': 'getItemTree/',
            'createItem': 'createItem',
            'item': 'item/'
        };

        $scope.sysMapName = "Systemic Map Items";

        var datas2 = function () {
            $http({

                method: 'GET',
                url: MainConf.servicesUrl() + $scope.urls.prefix + $scope.urls.tree + $scope.sysMapId,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                }

            }).then(function successCallback(response) {
                console.log('SysMap getItemTree data success', response);
                $scope.dataToRender = response.data.data.htmlCode;

                var urlSmall = MainConf.servicesUrl() + "ssm_view.php?token="
                    + authToken + "&id=" + $scope.sysMapId + "&t=" + Date.now() + "&v=0";
                var urlBig = MainConf.servicesUrl() + "ssm_view.php?token="
                    + authToken + "&id=" + $scope.sysMapId
                    + "&t=" + Date.now() + "&v=1";

                $scope.frameUrl = $sce.trustAsResourceUrl(urlSmall);
                $scope.frameUrl0 = $sce.trustAsResourceUrl(urlBig);

            }, function errorCallback(response) {
                console.warn('SysMap getItemTree data error', response);
                alert('SysMap getItemTree data error');
            });
        };

        datas2();

        $scope.addSysStructureMapItem = function (sysmid, question, proposal, groupId, color) {
            $http({

                method: 'POST',
                url: MainConf.servicesUrl() + $scope.urls.prefix + $scope.urls.createItem,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                },
                data: {
                    'systemic_map_id': $scope.sysMapId,
                    'question': question,
                    'proposal': proposal,
                    'from_item': sysmid,
                    'groupId': groupId,
                    'color': color
                }

            }).then(function successCallback(response) {
                console.log('SysMap systemicmap/createItem data success', response);
                $.bigBox({
                    title: "Systemic Map Item Ready!",
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
                //$state.go('app.ssm.manager.view.'+$scope.sysMapId);
            }, function errorCallback(response) {
                console.warn('SysMap systemicmap/createItem data error', response);
                alert('SysMap systemicmap/createItem data error');
            });
        };

        $scope.editSysStructureMapItem = function (sysmid, question, proposal, groupId) {
            $http({

                method: 'PUT',
                url: MainConf.servicesUrl() + $scope.urls.prefix + $scope.urls.item + sysmid,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                },
                data: {
                    'question': question,
                    'proposal': proposal,
                    'groupId': groupId
                    //'color' : color
                }

            }).then(function successCallback(response) {
                console.log('SysMap edit systemicmap/item data success', response);
                $.bigBox({
                    title: "Systemic Map Updated!",
                    color: "#739E73",
                    timeout: 5000,
                    icon: "fa fa-check",
                    number: "1"
                });

                $timeout(function () {
                    datas2();
                    $scope.$apply();
                }, 2);

            }, function errorCallback(response) {
                console.warn('SysMap edit systemicmap/item data error', response);
                alert('SysMap edit systemicmap/item data error');
            });
        };

        $scope.deleteSysStructureMapItem = function (sysmid) {

            $.SmartMessageBox({
                title: "This move cannot undone!",
                content: "The Systemic Map Item will be removed, are you sure about this ?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {

                if (ButtonPressed === "Yes") {

                    $http({

                        method: 'DELETE',
                        url: MainConf.servicesUrl() + $scope.urls.prefix + $scope.urls.item + sysmid,
                        headers: {
                            'Authorization': 'Bearer ' + authToken,
                            'Content-Type': 'application/json'
                        }

                    }).then(function successCallback(response) {
                        console.log('SysMap delete systemicmap/item data success', response);
                        var code = response.data.data.code;
                        var title = code === 1 ? "SUCCESS" : "ERROR";
                        var color = code === 1 ? "#739E73" : "#d81e1e";
                        var icon = code === 1 ? "fa fa-check" : "fa fa-exclamation-triangle";

                        var dialog_arr = document.getElementsByClassName("divMessageDialog");

                        console.log("Dialog:: ", dialog_arr);

                        $.bigBox({
                            title: title,
                            content: response.data.data.status,
                            color: color,
                            timeout: 15000,
                            icon: icon,
                            number: "1"
                        });

                        datas2();
                        $scope.$apply();

                    }, function errorCallback(response) {
                        console.warn('SysMap delete systemicmap/item data error', response);
                        alert('SysMap delete systemicmap/item data error');
                    });
                    $("#MsgBoxBack").removeClass("fadeIn").addClass("fadeOut").delay(300).queue(function () {
                        ExistMsg = 0, $(this).remove()
                    });

                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Your items are on place",
                        content: "<i class='fa fa-clock-o'></i> <i>Good decision...</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                    $("#MsgBoxBack").removeClass("fadeIn").addClass("fadeOut").delay(300).queue(function () {
                        ExistMsg = 0, $(this).remove()
                    });
                }
            });
        }
    });
"use strict";

angular.module('app.olset').controller('olsetIndexCtrl', function ($scope, $http, $window, $stateParams, $document, $state, $timeout, MainConf, ngDialog) {

    var authToken = $window.localStorage.getItem('authToken');
    $scope.token = authToken;
    $scope.surveyId = $stateParams.surveyId;
    $scope.surveyName = "Survey Items";

    $scope.openModaltoAddOrEdit = function (id, title, currentReality, initialIntentions, modalName) {
        ngDialog.open({
            template: MainConf.mainAppPath() + '/olset/views/edit-olset-process.html',
            scope: $scope
        });
        $scope.olsetData = {
            "id": id,
            "title": title,
            "CurrentReality": currentReality,
            "InitialIntentions": initialIntentions
        }
        $scope.addOrEditTitle = modalName;
    }

    var datas2 = function () {
        $http({
            method: 'GET',
            url: MainConf.servicesUrl() + 'process',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
            $scope.olsetIndexData = response.data.process;
            console.log($scope.olsetIndexData);
        }, function errorCallback(response) {
            $scope.olsetIndexData = response.data.process;
        });
    }

    datas2();

    $scope.editSurveyQuestion = function () {
        ///var groupId = 2;
        $http({

            method: 'PUT',
            url: MainConf.servicesUrl()+'systemicmap/item/'+$scope.surveyId,
            headers: {
                'Authorization': 'Bearer '+authToken,
                'Content-Type': 'application/json'
            },
            data: {
                "question":question,
                "description":description,
                "answered_type":2,
                "question_order":1
            }

        }).then(function successCallback(response) {

            $.bigBox({
                title: "Systemic Map Updated!",
                color: "#739E73",
                timeout: 5000,
                icon: "fa fa-check",
                number: "1"
            });

            $scope.closedthis = function() {

                var desde = "swseew";

            };

            $timeout(function() {
                datas2();
                //$scope.frameUrl = "http://144.76.5.203/olsetapp/public/sam_view.php?token="+authToken+"&id="+$scope.sysMapId+"&t="+Date.now()+"";
                $scope.$apply();
            }, 2);

            // $state.go('app.sysmap.manager.view.'+$scope.sysMapId);
            //$state.go('app.sysmap.manager.view',{"sysMapId": sysmid});

        }, function errorCallback(response) {

            console.log('YOYO');

        });

    }

    //Activate deactivate a process
    $scope.changeProcessStatus = function (theProcessId) {

        $http({
            method: 'GET',
            url: MainConf.servicesUrl() + 'process/' + theProcessId,
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
            $scope.olsetIndexData = response.data.process;
            console.log($scope.olsetIndexData);
        }, function errorCallback(response) {
            $scope.olsetIndexData = response.data.process;
        });
    }

    $scope.deleteOlsetIndexItem = function(sysmid) {

        $.SmartMessageBox({
            title: "This move cannot undone!",
            content: "This systemic map will be deleted ?",
            buttons: '[No][Yes]'
        }, function (ButtonPressed) {

            if (ButtonPressed === "Yes") {

                $http({

                    method: 'DELETE',
                    url: MainConf.servicesUrl()+'process/'+sysmid,
                    headers: {
                        'Authorization': 'Bearer '+authToken,
                        'Content-Type': 'application/json'
                    }

                }).then(function successCallback(response) {

                    //console.log("del: ",response);
                    //var code = response.data.data.code;
                    // var title = (code == 1)? "SUCCESS" : "ERROR";
                    // var color = (code == 1)? "#739E73" : "#d81e1e";
                    // var icon = (code == 1)? "fa fa-check" : "fa fa-exclamation-triangle";
                    var title = "SUCCESS";
                    var color = "#739E73";
                    var icon = "fa fa-check";

                    var dialog_arr = document.getElementsByClassName("divMessageDialog");

                    console.log("Dialog:: ", dialog_arr);
                    //dialog_arr[0].parentNode.removeChild(element);


                    //Error Logs
                    $.bigBox({
                        title: title,
                        content: "Deleted!",
                        color: color,
                        timeout: 15000,
                        icon: icon,
                        number: "1"
                    });
                    console.log("ABOUDITSI");
                    //$timeout(function() {
                    datas2();
                    $scope.$apply();
                    //return 0;
                    // }, 4);

                }, function errorCallback(response) {

                    //console.log('YATSU');

                });
                $("#MsgBoxBack").removeClass("fadeIn").addClass("fadeOut").delay(300).queue(function(){ExistMsg=0,$(this).remove()});

            }
            if (ButtonPressed === "No") {

                //return 0;

                $.smallBox({
                    title: "Your items are on place",
                    content: "<i class='fa fa-clock-o'></i> <i>Good decision...</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                $("#MsgBoxBack").removeClass("fadeIn").addClass("fadeOut").delay(300).queue(function(){ExistMsg=0,$(this).remove()});

            }
            //e.preventDefault();
        })}

        $scope.changeProcessStatus = function (processId, index) {

            $http({
                method: 'GET',
                url: MainConf.servicesUrl() + 'survey/changeProcessStatus/' + processId,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                }

            }).then(function successCallback(response) {
                if (response.data.data.current_status == "stopped") {
                    $scope.olsetIndexData[index].status = 0;
                } else if (response.data.data.current_status == "running") {
                    $scope.olsetIndexData[index].status = 1;
                }
                //
            }, function errorCallback(response) {
                //$scope.olsetProcessData = response.data.process;
                //console.log('YOYO');
                //console.log($scope.surveyQuestionData);
            });
        }

})
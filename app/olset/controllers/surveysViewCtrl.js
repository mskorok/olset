"use strict";


angular.module('app.surveys').controller('surveysViewCtrl', function ($scope, $http, $window, $stateParams, $document, $state, $timeout, MainConf, ngDialog) {

    var authToken = $window.localStorage.getItem('authToken');
    $scope.token = authToken;
    $scope.surveyId = $stateParams.surveyId;
    $scope.surveyName = "Survey Items";
    $scope.openModaltoAddOrEdit = function (id, question, description, mode, modalName) {
        ngDialog.open({
            template: MainConf.mainAppPath() + '/surveys/views/add-or-edit-question-view.html',
            scope: $scope
        });
        $scope.surveyData = {
            "id": id,
            "question": question,
            "description": description,
            "answered_type": "",
            "answered_collection": [],
            "question_order": 1
        }
        $scope.modalMode = mode;
        $scope.addOrEditTitle = modalName;
    }

    var datas2 = function () {
        $http({
            method: 'GET',
            url: MainConf.servicesUrl() + 'survey/getQuestions/' + $scope.surveyId,
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            }

        }).then(function successCallback(response) {
            $scope.surveyQuestionData = response.data.data.data;
            $scope.olsetEvaluationGroupsData = response.data.data.groups;
        }, function errorCallback(response) {

            //console.log('YOYO');

        });

    }

    /*var datas2 = function () {

        $http({

            method: 'GET',
            url: MainConf.servicesUrl()+'survey/getQuestions/'+$scope.surveyId,
            headers: {
                'Authorization': 'Bearer '+authToken,
                'Content-Type': 'application/json'
            }

        }).then(function successCallback(response) {

            ///$scope.$apply();
            console.log('render html: ',$scope.dataToRender);

        }, function errorCallback(response) {

            //console.log('YOYO');

        });
    }*/

    //}, 0);

    datas2();

    $scope.addSurveyQuestion = function () {
        //var groupId = 2;
        $http({

            method: 'POST',
            url: MainConf.servicesUrl() + 'survey/addQuestion/' + $scope.surveyId,
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            },
            data: {
                "question": $scope.surveyData.question,
                "description": $scope.surveyData.description,
                "answered_type": $scope.surveyData.answered_type,
                "question_order": $scope.surveyData.question_order
            }

        }).then(function successCallback(response) {
            ngDialog.close();
            $.bigBox({
                title: "Systemic Map Item Ready!",
                //content: question + ", just created also a new systemic map Item is here for you just to begin.",
                color: "#739E73",
                timeout: 5000,
                icon: "fa fa-check",
                number: "1"
            });

            $scope.closedthis = function () {

                var desde = "swseew";
            };

            $timeout(function () {
                datas2();
                $scope.$apply();
            }, 2);
            //$state.go('app.sysmap.manager.view.'+$scope.sysMapId);
        }, function errorCallback(response) {

            console.log('YOYO');

        });

    }

    /*
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


    $scope.deleteSysMapItem = function(sysmid) {

        $.SmartMessageBox({
            title: "This move cannot undone!",
            content: "The Systemic Map Item will be removed, are you sure about this ?",
            buttons: '[No][Yes]'
        }, function (ButtonPressed) {

            if (ButtonPressed === "Yes") {

                $http({

                    method: 'DELETE',
                    url: MainConf.servicesUrl()+'systemicmap/item/'+sysmid,
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


                        var dialog_arr = document.getElementsByClassName("divMessageDialog");

                        console.log("Dialog:: ", dialog_arr);
                        //dialog_arr[0].parentNode.removeChild(element);


                        //Error Logs
                        $.bigBox({
                            title: title,
                            content: response.data.data.status,
                            color: color,
                            timeout: 15000,
                            icon: icon,
                            number: "1"
                        });

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
        });


    }*/

})
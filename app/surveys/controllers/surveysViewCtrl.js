angular.module('app.surveys').controller(
    'surveysViewCtrl',
    function ($scope, $http, $window, $stateParams, $document, $state, $timeout, MainConf, ngDialog) {

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
            };
            $scope.modalMode = mode;
            $scope.addOrEditTitle = modalName;
        };

        var datas2 = function () {
            $http({
                method: 'GET',
                url: MainConf.servicesUrl() + 'survey/getQuestions/' + $scope.surveyId,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                }

            }).then(function successCallback(response) {
                console.log('Survey getQuestions success:', response);
                $scope.surveyQuestionData = response.data.data.data;
                $scope.olsetEvaluationGroupsData = response.data.data.groups;
            }, function errorCallback(response) {
                console.warn('Survey getQuestions data error', response);
                alert('Survey getQuestions data error');
            });
        };

        datas2();

        $scope.addSurveyQuestion = function () {
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
                console.log('Survey addQuestion success:', response);
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

                    // var des = "sws";
                };

                $timeout(function () {
                    datas2();
                    $scope.$apply();
                }, 2);
                //$state.go('app.sysmap.manager.view.'+$scope.sysMapId);
            }, function errorCallback(response) {
                console.warn('Survey addQuestion data error', response);
                alert('Survey addQuestion data error');
            });

        };

        $scope.addSurveyQuestion = function () {
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
                console.log('Survey addQuestion success:', response);
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

                    // var des = "sws";
                };

                $timeout(function () {
                    datas2();
                    $scope.$apply();
                }, 2);
                //$state.go('app.sysmap.manager.view.'+$scope.sysMapId);
            }, function errorCallback(response) {
                console.warn('Survey addQuestion data error', response);
                alert('Survey addQuestion data error');
            });

        }
    });
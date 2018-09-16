angular.module('app.olset').controller(
    'olsetEvaluationCtrl',
    function ($scope, $http, $window, $stateParams, $document, $state, $timeout, MainConf, ngDialog) {

        var authToken = $window.localStorage.getItem('authToken');
        $scope.token = authToken;
        $scope.evaluationId = $stateParams.evaluationId;
        $scope.surveyName = "Survey Items";

        $scope.userAnswers = [];

        $scope.userAnswersTosend = [];


        var theUserAnswers = function () {
            $http({
                method: 'GET',
                url: MainConf.servicesUrl() + 'survey/getSurveyAnswers/' + $scope.evaluationId,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                }

            }).then(function successCallback(response) {
                $scope.olsetUserEditInfos = response.data.data.data;

                for (var i = 0; $scope.olsetUserEditInfos.length > i; i++) {
                    var answer = {
                        "questionId": null,
                        "answer": null
                    };
                    answer.questionId = $scope.olsetUserEditInfos[i].questionId;
                    answer.answer = $scope.olsetUserEditInfos[i].answer;

                    //$scope.userAnswers.push(answer);

                    $scope.userAnswers[$scope.olsetUserEditInfos[i].questionId] = answer;
                }
                console.log("the user answers: ", $scope.userAnswers);

            }, function errorCallback(response) {
                console.log('Olset theUserAnswers data error', response);
                alert('Olset theUserAnswers data error');
                $scope.olsetUserEditInfos = response.data.data.data;
            });
        };
        setTimeout(theUserAnswers, 1000);

        $scope.makeUpdate = function () {

            $scope.userAnswers.forEach(function (item) {
                if (item.answer) {
                    $scope.userAnswersTosend.push(item);
                }
            });

            if ($scope.userAnswersTosend.length > 0) {
                console.log('User Answers:', $scope.userAnswersTosend);
                $http({

                    method: 'POST',
                    url: MainConf.servicesUrl() + 'survey/answers',
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                        'Content-Type': 'application/json'
                    },
                    data: $scope.userAnswersTosend

                }).then(function successCallback(response) {
                    ngDialog.close();
                    var bmessage = "";
                    var bcolor = "";
                    if (response.data.data.status == "Error") {
                        bmessage = "Could not save answers";
                        bcolor = "#d81e1e";
                    } else {
                        bmessage = "Answers updated";
                        bcolor = "#739E73";
                    }
                    $.bigBox({
                        title: bmessage,
                        //content: question + ", just created also
                        // a new systemic map Item is here for you just to begin.",
                        color: bcolor,
                        timeout: 5000,
                        icon: "fa fa-check",
                        number: "1"
                    });
                    if (!(typeof $scope.olsetEvaluationProcess.id === 'undefined')) {
                        $state.go('app.olset.process', {processId: $scope.olsetEvaluationProcess.id});
                    } else {
                        $state.go('app.dashboard');
                    }
                }, function errorCallback(response) {
                    console.log('Olset makeUpdate data error', response);
                    alert('Olset makeUpdate data error');
                });

            }

        };


        var datas2 = function () {
            $http({
                method: 'GET',
                url: MainConf.servicesUrl() + 'survey/getQuestions/' + $scope.evaluationId,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                }
            }).then(function successCallback(response) {
                $scope.olsetEvaluationData = response.data.data.data;

                $scope.olsetEvaluationGroupsData = response.data.data.groups;
                $scope.olsetEvaluationProcess = response.data.data.process;
                $scope.isActionAAR = response.data.data.isActionAAR;
                console.log(
                    'Olset survey/getQuestions data success',
                    $scope.olsetEvaluationData,
                    $scope.olsetEvaluationGroupsData,
                    $scope.olsetEvaluationProcess,
                    $scope.isActionAAR
                );
            }, function errorCallback(response) {
                console.log('Olset survey/getQuestions data error', response);
                alert('Olset survey/getQuestions data error');
                $scope.olsetEvaluationData = response.data.process;
            });
        };

        datas2();
    }
);
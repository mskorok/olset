angular.module('app.olset').controller(
    'olsetEvaluationCtrl',
    function ($scope, $http, $window, $stateParams, $document, $state, $timeout, MainConf, ngDialog) {

        var authToken = $window.localStorage.getItem('authToken');
        $scope.token = authToken;
        $scope.evaluationId = $stateParams.evaluationId;
        $scope.surveyName = 'Survey Items';

        $scope.userAnswers = [];

        $scope.userAnswersToSend = [];

        $scope.makeUpdate = function () {

            $scope.userAnswers.forEach(function (item) {
                if (item.answer) {
                    $scope.userAnswersToSend.push(item);
                }
            });
            var count;
            switch (parseInt($scope.olsetEvaluationData[0].answered_type)) {
                case 1:
                    count = MainConf.answer.aarCount;
                    break;
                case 2:
                    count = MainConf.answer.evaluationCount;
                    break;
                case 3:
                    count = MainConf.answer.demographicsCount;
                    break;
                case 4:
                    count = MainConf.answer.CRSCount;
                    break;
                case 5:
                    count = MainConf.answer.VSCount;
                    break;
                default:
                    console.log('ÆÆ', typeof $scope.olsetEvaluationData[0].answered_type);
                    throw 'Answer type not found'
            }
            if ($scope.userAnswersToSend.length !== count) {
                $.bigBox({
                    title: 'Answer all questions!',
                    //content: question + ", just created also
                    // a new systemic map Item is here for you just to begin.",
                    color: "#C46A69",
                    timeout: 5000,
                    icon: "fa fa-check",
                    number: "1"
                });
                $scope.userAnswersToSend = [];
                return false;
            }

            if ($scope.userAnswersToSend.length > 0) {
                console.log('User Answers:', $scope.userAnswersToSend);
                $http({

                    method: 'POST',
                    url: MainConf.servicesUrl() + 'survey/answers/' + $scope.survey.id,
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                        'Content-Type': 'application/json'
                    },
                    data: $scope.userAnswersToSend

                }).then(function successCallback(response) {
                    ngDialog.close();
                    var bmessage;
                    var bcolor;
                    if (response.data.data.status == "Error") {
                        bmessage = 'Could not save answers';
                        bcolor = '#d81e1e';
                    } else {
                        bmessage = 'Answers updated';
                        bcolor = '#739E73';
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

            return true;
        };

        var evaluate = {
            init: function () {
                var self = this;
                $http({
                    method: 'GET',
                    url: MainConf.servicesUrl() + 'survey/getQuestions/' + $scope.evaluationId,
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                        'Content-Type': 'application/json'
                    }
                }).then(function successCallback(response) {
                    $scope.survey = response.data.data.survey;
                    if ($scope.survey.tag !== MainConf.survey.evaluation && $scope.survey.tag !== MainConf.survey.AAR) {
                        self.theUserAnswers();
                    }

                    $scope.olsetEvaluationData = response.data.data.data;

                    $scope.olsetEvaluationGroupsData = response.data.data.groups;
                    $scope.olsetEvaluationProcess = response.data.data.process;
                    $scope.isActionAAR = response.data.data.isActionAAR;
                    $scope.questionGroups = response.data.data.groups;
                    $scope.initOption = 'Choose Answer';
                    $scope.isDemographics = response.data.data.isDemographics;



                    console.log(
                        'Olset survey/getQuestions data success',
                        response.data.data
                    );
                }, function errorCallback(response) {
                    console.log('Olset survey/getQuestions data error', response);
                    alert('Olset survey/getQuestions data error');
                    $scope.olsetEvaluationData = response.data.process;
                });
            },
            theUserAnswers: function () {
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

                        $scope.userAnswers[$scope.olsetUserEditInfos[i].questionId] = answer;
                    }
                    console.log('the user answers: ', $scope.userAnswers, new Date().getTime());

                }, function errorCallback(response) {
                    console.log('Olset theUserAnswers data error', response);
                    alert('Olset theUserAnswers data error');
                    $scope.olsetUserEditInfos = response.data.data.data;
                });
            }
        };

        evaluate.init();
    }
);
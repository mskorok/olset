angular.module('app.olset').controller(
    'olsetFlowCtrl',
    function ($scope, $http, $window, $stateParams, $document, $state, $timeout, MainConf, ngDialog) {

        var flow = {};

        var authToken = $window.localStorage.getItem('authToken');
        $scope.token = authToken;
        $scope.processId = $stateParams.processId;
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
            };
            $scope.addOrEditTitle = modalName;
        };

        var getData = function () {
            $http({
                method: 'GET',
                url: MainConf.servicesUrl() + 'process/' + $scope.processId + '?include=ProcessYearSurvey',
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                }

            }).then(function successCallback(response) {
                console.log('Olset process data success', response);
                $scope.olsetProcessData = response.data.process;
                angular.element(document).ready(function () {
                    ClassicEditor.create(document.querySelector('#current_reality_editor'))
                        .then(function (editor) {
                            editor.setData($scope.olsetProcessData.CurrentReality);
                            console.log('Current reality editor created');
                        }).catch(function (error) {
                        console.error(error);
                    });
                    ClassicEditor.create(document.querySelector('#initial_intentions_editor'))
                        .then(function (editor) {
                            editor.setData($scope.olsetProcessData.InitialIntentions);
                            console.log('Initial intentions editor created');
                        }).catch(function (error) {
                        console.error(error);
                    });
                    var current_reality_form = document.getElementById('current_reality_form');
                    if (current_reality_form) {
                        current_reality_form.addEventListener('submit', function (ev) {
                            ev.preventDefault();
                            ev.stopPropagation();
                            console.log('form', this);
                            return false;
                        })
                    }
                    var initial_intentions_form = document.getElementById('initial_intentions_form');
                    if (initial_intentions_form) {
                        initial_intentions_form.addEventListener('submit', function (ev) {
                            ev.preventDefault();
                            ev.stopPropagation();
                            console.log('form2', this);
                            return false;
                        })
                    }
                });
            }, function errorCallback(response) {
                $scope.olsetProcessData = response.data.process;
                console.log('Olset process data error', response);
                alert('Olset process data error');
            });

            $http({
                method: 'GET',
                url: MainConf.servicesUrl() + 'year-survey/full/' + $scope.processId,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                }

            }).then(function successCallback(response) {
                console.log('Olset year data success', response.data.data);
                $scope.processFullData = response.data.data;
                $scope.emtyYearData = $scope.processFullData[0]['ProcessYearSurvey'].id === null
                    || $scope.processFullData[0]['ProcessYearSurvey'].id === 'null';
                console.log('p', $scope.processFullData[0]['Process']);
                $scope.process = $scope.processFullData[0]['Process'];
                var processYearSurveys = [];
                [].forEach.call($scope.processFullData, function (item) {
                    processYearSurveys.push(item['ProcessYearSurvey']);
                });

                $scope.processYears = processYearSurveys;
                $scope.processYear = $scope.processFullData[0]['Process'].createdAt.substring(0, 4);
                $scope.lastYear = function (year) {
                    var date = new Date(year);
                    return date.getFullYear() - 1;

                };
                $scope.nextYear = function () {
                    var date = new Date();
                    return date.getFullYear() + 1;

                };
                $scope.lastYearSurvey = function(key) {
                    if (key - 1 > -1) {
                        return $scope.processYears[key-1]['survey_id'];
                    } else {
                        return 0;
                    }

                }

            }, function errorCallback(response) {
                console.log('Olset year data error', response);
                alert('Olset year data error');
            });
        };

        getData();


    }
);
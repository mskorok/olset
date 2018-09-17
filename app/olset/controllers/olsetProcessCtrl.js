angular.module('app.olset').controller(
    'olsetProcessCtrl',
    function ($rootScope, $scope, $http, $window, $stateParams, $document, $state, $timeout, MainConf, ngDialog) {
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
        $scope.openModalAAR = function (id) {
            ngDialog.open({
                template: MainConf.mainAppPath() + '/olset/views/modal-aar.html',
                scope: $scope
            });
            $scope.modalAARid = id;
            $rootScope.$on('ngDialog.opened', function (e, $dialog) {
                flow.awesomplete('action', [{field: "extra_info", selector: "#aar"}]);
                $scope.addAAR = function () {
                    var value = actions_select.value;
                    value = value.replace('string:', '');
                    value = value.replace('number:', '');
                    flow.createActionAAR(value);
                };
                $scope.searchAAR = function () {
                    var value = aar.value;
                    return false;
                };
            });
        };
        var flow = {
            awe_url: MainConf.servicesUrl() + 'process/awe/' + $scope.processId,
            action_survey_url: MainConf.servicesUrl() + 'survey/action/aar/create/',
            getItems: function() {
                $http({
                    method: 'GET',
                    url: this.awe_url,
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                        'Content-Type': 'application/json'
                    }

                }).then(function successCallback(response) {
                    var items = response.data.data.data;
                    [].forEach.call(items, function (item) {
                        item.proposal = item.proposal.substr(0, 40);
                    });
                    console.log('items', items);
                    $scope.items = items;
                    $scope.aar = response.data.data.aar;
                }, function errorCallback(response) {
                    console.log('Shared Vision data error', response);
                });
            },
            awesomplete: function (field, selectors) {
                var obj = $scope.aar;
                //selectors = [{field: "field", selector: "selector"},{field: "field", selector: "selector"}]
                selectors.forEach(function (item) {
                    var list = obj.map(function (i) {
                        return i[item.field];
                    });

                    list = list.filter(function (x, i, a) {
                        return a.indexOf(x) === i;
                    });
                    new Awesomplete(document.querySelector(item.selector), {list: list});
                });
            },
            createActionAAR: function (itemId) {
                // itemId = parseInt(itemId);
                var self = this;
                $http({
                    method: 'GET',
                    url: self.action_survey_url + itemId,
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                        'Content-Type': 'application/json'
                    }

                }).then(function successCallback(response) {
                    var survey_id = response.data.data.data;
                    console.log('New Action AAR success', response);
                    ngDialog.closeAll();
                    $state.go('app.olset.evaluation', {evaluationId: survey_id});

                }, function errorCallback(response) {
                    console.log('New Action AAR error', response);
                });
            }
        };


        var getData = function () {
            $http({
                method: 'GET',
                url: MainConf.servicesUrl() + 'process/' + $scope.processId,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                }

            }).then(function successCallback(response) {
                console.log('Olset process data success', response);
                $scope.olsetProcessData = response.data.process;
                $scope.olsetProcessData.SharedVision = $scope.olsetProcessData.SharedVision === null
                || $scope.olsetProcessData.SharedVision === 'null' ? '' : $scope.olsetProcessData.SharedVision;
                angular.element(document).ready(function () {
                    ClassicEditor.create(document.querySelector('#current_reality_editor'))
                        .then(function (editor) {
                            editor.setData($scope.olsetProcessData.CurrentReality);
                        }).catch(function (error) {
                        console.error(error);
                    });
                    ClassicEditor.create(document.querySelector('#initial_intentions_editor'))
                        .then(function (editor) {
                            editor.setData($scope.olsetProcessData.InitialIntentions);
                        }).catch(function (error) {
                        console.error(error);
                    });
                    ClassicEditor.create(document.querySelector('#shared_vision_editor'))
                        .then(function (editor) {
                            editor.setData($scope.olsetProcessData.SharedVision);
                        }).catch(function (error) {
                        console.error(error);
                    });

                    var current_reality_form = document.getElementById('current_reality_form');
                    if (current_reality_form) {
                        current_reality_form.addEventListener('submit', function (ev) {
                            ev.preventDefault();
                            ev.stopPropagation();
                            var input = this.querySelector('#current_reality_editor');
                            var uri = 'process/current/' + $scope.processId;
                            $http({
                                method: 'POST',
                                url: MainConf.servicesUrl() + uri,
                                headers: {
                                    'Authorization': 'Bearer ' + authToken,
                                    'Content-Type': 'application/json'
                                },
                                data: {
                                    "text": input.value
                                }

                            }).then(function successCallback(response) {
                                console.log('Current Reality data success', response);
                                $.bigBox({
                                    title: "New current reality description added!",
                                    color: "#739E73",
                                    timeout: 5000,
                                    icon: "fa fa-check",
                                    number: "1"
                                });
                                ngDialog.close();
                            }, function errorCallback(response) {
                                console.log('Current Reality data error', response);
                            });

                            return false;
                        })
                    }
                    var shared_vision_form = document.getElementById('shared_vision_form');
                    if (shared_vision_form) {
                        shared_vision_form.addEventListener('submit', function (ev) {
                            ev.preventDefault();
                            ev.stopPropagation();
                            var input = this.querySelector('#shared_vision_editor');
                            var uri = 'process/shared/' + $scope.processId;
                            $http({
                                method: 'POST',
                                url: MainConf.servicesUrl() + uri,
                                headers: {
                                    'Authorization': 'Bearer ' + authToken,
                                    'Content-Type': 'application/json'
                                },
                                data: {
                                    "text": input.value
                                }

                            }).then(function successCallback(response) {
                                console.log('Shared Vision data success', response);
                                $.bigBox({
                                    title: "New shared vision description added!",
                                    color: "#739E73",
                                    timeout: 5000,
                                    icon: "fa fa-check",
                                    number: "1"
                                });
                                ngDialog.close();
                            }, function errorCallback(response) {
                                console.log('Shared Vision data error', response);
                            });

                            return false;
                        })
                    }
                    var initial_intentions_form = document.getElementById('initial_intentions_form');
                    if (initial_intentions_form) {
                        initial_intentions_form.addEventListener('submit', function (ev) {
                            ev.preventDefault();
                            ev.stopPropagation();
                            var input = this.querySelector('#initial_intentions_editor');
                            var uri = 'process/initial/' + $scope.processId;
                            $http({
                                method: 'POST',
                                url: MainConf.servicesUrl() + uri,
                                headers: {
                                    'Authorization': 'Bearer ' + authToken,
                                    'Content-Type': 'application/json'
                                },
                                data: {
                                    "text": input.value
                                }

                            }).then(function successCallback(response) {
                                console.log('Initial Intentions data success', response);
                                $.bigBox({
                                    title: "New initial intentions description added!",
                                    color: "#739E73",
                                    timeout: 5000,
                                    icon: "fa fa-check",
                                    number: "1"
                                });
                                ngDialog.close();
                            }, function errorCallback(response) {
                                console.log('Initial Intentions data error', response);
                            });

                            return false;
                        })
                    }
                });
            }, function errorCallback(response) {
                $scope.olsetProcessData = response.data.process;
                console.log('Olset process data error', response);
                alert('Olset process data error');
            });
        };

        getData();
        flow.getItems();


    }
);
angular.module('app.olset').controller(
    'olsetProcessCtrl',
    function ($rootScope, $scope, $http, $window, $stateParams, $document, $state, $timeout, MainConf, ngDialog, Auth) {
        var authToken = $window.localStorage.getItem('authToken');
        $scope.token = authToken;
        $scope.processId = $stateParams.processId;
        $scope.surveyName = "Survey Items";
        $scope.openDemo = false;
        $scope.openPIS = false;
        $scope.openInitial = false;
        $scope.openCRS = false;
        $scope.openVS = false;
        $scope.openEvaluation = false;
        $scope.openAAR = false;
        $scope.openItemsAAR = false;
        $scope.openCRText = false;
        $scope.openIIText = false;
        $scope.openSVText = false;

        $scope.openSAM = false;
        $scope.openSSM = false;

        $scope.isCreator = false;

        $scope.isManager = false;
        $scope.isAdmin = false;


        if ('app.olset.evaluation' === $rootScope.previousState.name) {
            window.location.reload();
        }
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
                    flow.listActionAAR(value);
                    return false;
                };
            });
        };


        $scope.role = Auth.userHaveRole();

        if ($scope.role) {
            if ($scope.role === 'Manager') {
                $scope.isManager = true;
            } else if ($scope.role === 'User') {
                $scope.isUser = true;
            } else if ($scope.role === 'Administrator') {
                $scope.isAdmin = true;
            }
            console.log('User role: ', $scope.role);
        } else {
            $scope.userRole = false;
        }

        $scope.$watch(Auth.userHaveRole, function (value, oldValue) {
            // console.log('roleValueW: ', value);
            $scope.userRole = value;

            if (value) {
                if (value == 'Manager') {
                    $scope.isManager = true;
                } else if (value == 'User') {
                    $scope.isUser = true;
                } else if (value == 'Administrator') {
                    $scope.isAdmin = true;
                }
                // console.log('the val: ', value);
            } else {
                $scope.userRole = false;
            }

        }, true);

        var flow = {
            awe_url: MainConf.servicesUrl() + 'process/awe/' + $scope.processId,
            action_survey_url: MainConf.servicesUrl() + 'survey/action/aar/create/',
            pis_url: MainConf.servicesUrl() + 'process/pis/' + $scope.processId,
            init: function () {
                var self = this;
                var time = new Date().getTime();
                console.log('start', new Date().getTime());
                $http({
                    method: 'GET',
                    url: MainConf.servicesUrl() + 'process/data/' + $scope.processId,
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                        'Content-Type': 'application/json'
                    }

                }).then(function successCallback(response) {
                    console.log('finish', time - new Date().getTime());
                    console.log('Olset process data success', response);
                    $scope.olsetProcessData = response.data.data.process;
                    $scope.olsetStepsFlags = response.data.data.steps;
                    self.setSequence($scope.olsetStepsFlags);
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
                    console.log('error finish', time - new Date().getTime());
                    $scope.olsetProcessData = response.data.process;
                    console.log('Olset process data error', response);
                    alert('Olset process data error');
                });
            },
            getItems: function() {
                $http({
                    method: 'GET',
                    url: this.awe_url,
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                        'Content-Type': 'application/json'
                    }

                }).then(function successCallback(response) {
                    var items = response.data.data.code == 1 ? response.data.data.data : [];
                    [].forEach.call(items, function (item) {
                        if(item.proposal) {
                            item.proposal = item.proposal.substr(0, 40);
                        }
                        console.log('item', item);
                    });
                    console.log('items', items);
                    $scope.items = items;
                    $scope.aar = response.data.data.code == 1 ? response.data.data.aar : [];
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
                    console.log('list', list);
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
            },
            listActionAAR: function (value) {
                var survey_id = null;
                [].forEach.call($scope.aar, function (survey) {
                    if (survey.hasOwnProperty('extra_info') && survey.extra_info.substr(0, 20) === value.substr(0,20)) {
                        survey_id = survey.id;
                    }

                });
                if (null !== survey_id) {
                    ngDialog.closeAll();
                    $state.go('app.olset.evaluation.list', {evaluationId: survey_id});
                }
                alert('Survey with extra info: ' + value + ' not found')
            },
            openModalPIS: function () {
                var self = this;
                ngDialog.open({
                    template: MainConf.mainAppPath() + '/olset/views/modal-pis.html',
                    scope: $scope
                });

                $rootScope.$on('ngDialog.closed', function (e, $dialog) {
                    window.location.reload();
                });

                $rootScope.$on('ngDialog.opened', function (e, $dialog) {
                    $timeout(function() {
                        $('.app-pis').animate({ scrollTop: 0 }, 'slow');
                    }, 1000);
                    $scope.addPIS = function () {
                        console.log('PIS submitted');
                        ngDialog.closeAll();
                        $http({
                            method: 'GET',
                            url: self.pis_url,
                            headers: {
                                'Authorization': 'Bearer ' + authToken,
                                'Content-Type': 'application/json'
                            }
                        }).then(function successCallback(response) {
                            if (parseInt(response.data.data.code) === 1) {
                                console.log('PIS data success', response);
                                $timeout(function() {
                                    window.location.reload();
                                }, 500);
                            } else {
                                console.log('PIS data error', response);
                                $.bigBox({
                                    title: 'PIS not created!',
                                    //content: question + ", just created also
                                    // a new systemic map Item is here for you just to begin.",
                                    color: "#C46A69",
                                    timeout: 5000,
                                    icon: "fa fa-check",
                                    number: "1"
                                });
                            }
                        }, function errorCallback(response) {
                            console.log('PIS data error', response);
                            $.bigBox({
                                title: 'PIS not created!',
                                //content: question + ", just created also
                                // a new systemic map Item is here for you just to begin.",
                                color: "#C46A69",
                                timeout: 5000,
                                icon: "fa fa-check",
                                number: "1"
                            });
                        });
                    };
                });
            },
            redirectToDemographics: function (id) {
                $state.go('app.olset.evaluation', {evaluationId: id});
            },
            setSequence: function (steps) {
                if (steps.hasOwnProperty('hasCRText') && !steps.hasCRText) {
                    $scope.openCRText = true;
                }

                if (steps.hasOwnProperty('hasIIText') && steps.hasIIText) {
                    $scope.openIIText = true;
                }

                if (steps.hasOwnProperty('hasSVText') && steps.hasSVText) {
                    $scope.openSVText = true;
                }

                if (steps.hasOwnProperty('isCreator') && steps.isCreator) {
                    $scope.isCreator = true;
                }

                angular.element(document).ready(function () {
                    var block_ii = document.getElementById('block_ii');
                    var block_sv = document.getElementById('block_sv');
                    var block_cr = document.getElementById('block_cr');

                    var owner = $scope.isManager || $scope.isAdmin || $scope.isCreator;
                    if (block_ii && !owner && $scope.openIIText) {
                        var btn_ii = block_ii.querySelector('button');
                        if (btn_ii) {
                            btn_ii.parentNode.removeChild(btn_ii);
                        }
                        // block_ii.style.display = 'none';
                    }

                    if (block_sv && !owner && $scope.openIIText) {
                        var btn_sv = block_sv.querySelector('button');
                        if (btn_sv) {
                            btn_sv.parentNode.removeChild(btn_sv);
                        }
                        // block_sv.style.display = 'none';
                    }

                    if (block_cr && !owner && $scope.openIIText) {
                        var btn_cr = block_cr.querySelector('button');
                        if (btn_cr) {
                            btn_cr.parentNode.removeChild(btn_cr);
                        }


                        // block_cr.style.display = 'none';
                    }
                });

                if (steps.hasOwnProperty('hasDemographics')
                    && !steps.hasDemographics
                ) {
                    if (steps.hasOwnProperty('demographicsSurvey')
                        && typeof steps.demographicsSurvey.id !== 'undefined'
                    ) {
                        this.redirectToDemographics(parseInt(steps.demographicsSurvey.id));
                    } else {
                        throw 'steps.demographicsSurvey.id is undefined';
                    }

                } else if (steps.hasOwnProperty('hasPIS') && !steps.hasPIS) {
                    this.openModalPIS();
                } else if (steps.hasOwnProperty('hasInitial') && !steps.hasInitial) {
                    $scope.openInitial = true;
                } else if (steps.hasOwnProperty('hasCRS') && !steps.hasCRS) {
                    if ($scope.isManager || $scope.isAdmin) {
                        $scope.openCRS = true;
                    } else {
                        if (steps.hasOwnProperty('hasEvaluation') && !steps.hasEvaluation) {
                            $scope.openEvaluation = true;
                        }else if (steps.hasOwnProperty('hasAAR') && !steps.hasAAR) {
                            $scope.openAAR = true;
                        } else {
                            $scope.openItemsAAR = true;
                            $scope.openSAM = true;
                            $scope.openSSM = true;
                        }
                    }
                } else if (steps.hasOwnProperty('hasVS') && !steps.hasVS) {
                    if ($scope.isManager || $scope.isAdmin) {
                        $scope.openVS = true;
                    } else {
                        if (steps.hasOwnProperty('hasEvaluation') && !steps.hasEvaluation) {
                            $scope.openEvaluation = true;
                        }else if (steps.hasOwnProperty('hasAAR') && !steps.hasAAR) {
                            $scope.openAAR = true;
                        } else {
                            $scope.openItemsAAR = true;
                            $scope.openSAM = true;
                            $scope.openSSM = true;
                        }
                    }
                } else if (steps.hasOwnProperty('hasEvaluation') && !steps.hasEvaluation) {
                    $scope.openEvaluation = true;
                } else if (steps.hasOwnProperty('hasAAR') && !steps.hasAAR) {
                    $scope.openAAR = true;
                } else {
                    $scope.openItemsAAR = true;
                    $scope.openSAM = true;
                    $scope.openSSM = true;
                }

            }
        };


        flow.init();
        flow.getItems();
        angular.element(document).ready(function () {//todo remove after testing
            // flow.openModalPIS();
        });
    }
);
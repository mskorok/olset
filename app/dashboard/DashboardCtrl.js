angular.module('app.dashboard').controller(
    'DashboardCtrl',
    function ($rootScope, $scope, $http, $window, $stateParams, $document, $state, $timeout, MainConf, Auth, ngDialog) {
        $scope.token = $window.localStorage.getItem('authToken');

        $scope.isManager = false;
        $scope.isAdmin = false;

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
        $scope.i++;


        console.log('ææ', $window.localStorage.getItem("subscription"));

        var dashboard = {
            single_report_url: 'report/single',
            group_report_url: 'report/group',
            subscription_url : 'process/subscription/',
            addTexts: function (firstProcess) {
                var crs = document.getElementById('crs_text');
                if (crs) {
                    crs.innerHTML = firstProcess.CurrentReality;
                }

                var vs = document.getElementById('vs_text');
                if (vs) {
                    vs.innerHTML = firstProcess.InitialIntentions;
                }
            },
            data: function () {
                var self = this;
                console.log('token', $scope.token);
                console.log('subscription', $scope.subscription);
                if (Auth.userHaveRole() === "Manager") {
                    $http({
                        method: 'GET',
                        url: MainConf.servicesUrl() + 'statistics/dashboard',
                        headers: {
                            'Authorization': 'Bearer ' + $scope.token,
                            'Content-Type': 'application/json'
                        }

                    }).then(function successCallback(response) {
                        // console.log('Dashboard data success', response);
                        $scope.olsetStatsInfo = response.data.data.data;
                        $scope.firstProcess = response.data.data.data.process;
                        $scope.isProcess = $scope.firstProcess !== null;
                        $scope.subscriptions = response.data.data.data.subscriptions;
                        // console.log ('si', $scope.subscriptions.length, $scope.i);
                        if ($scope.subscriptions.length > 0 && $scope.i === 2) {
                            angular.element(document).ready(function () {
                                var current_subscription = $window.localStorage.getItem("subscription");
                                console.log(123, $scope.i, current_subscription);
                                if (typeof current_subscription === 'undefined' || current_subscription === null) {
                                    self.openModalSubscriptions();
                                }
                            });
                        }
                        self.addTexts($scope.firstProcess);
                        // console.log('dashboard resp', $scope.subscriptions, $scope.subscriptions.length);

                    }, function errorCallback(response) {
                        console.warn('Dashboard data error', response);
                        // alert('Dashboard data error');
                        // $scope.olsetStatsInfo = response.data.data.data;
                        // console.log('data error', $scope.olsetStatsInfo);
                    });
                }

                $http({
                    method: 'GET',
                    url: MainConf.servicesUrl() + 'survey/getAvailableSurveys',
                    headers: {
                        'Authorization': 'Bearer ' + $scope.token,
                        'Content-Type': 'application/json'
                    }

                }).then(function successCallback(response) {
                    console.log('Dashboard getAvailableSurveys data success', response);
                    $scope.olsetSurvey = response.data.data.data;
                    angular.element(document).ready(function () {
                        // self.renderProcessesData();
                        self.startWidget();
                    });
                    // console.log('user surveys:: ', $scope.olsetSurvey);

                }, function errorCallback(response) {
                    console.warn('Dashboard getAvailableSurveys data error', response);
                    // alert('Dashboard getAvailableSurveys data error');
                    // console.log('error process data ', $scope.olsetProcessData);
                });

                this.getSingleReport();
                this.getGroupReport();

                //$scope.$apply();
            },
            startWidget: function () {
                var elements = document.getElementsByClassName('process-widget');
                if (elements) {
                    [].forEach.call(elements, function (el) {
                        var element = $(el);
                        $rootScope.$emit('jarvisWidgetAdded', element )
                    })
                }
            },
            getSingleReport: function () {
                $http({
                    method: 'GET',
                    url: MainConf.servicesUrl() + this.single_report_url,
                    headers: {
                        'Authorization': 'Bearer ' + $scope.token,
                        'Content-Type': 'application/json'
                    }

                }).then(function successCallback(response) {
                    // console.log('Single Report', response);
                    $scope.singleReport = response.data.data.data.report;
                    angular.element(document).ready(function () {
                        var link = document.getElementById('single_report_link');
                        if (link) {
                            link.setAttribute('href', $scope.singleReport);
                        }
                    });
                }, function errorCallback(response) {
                    console.warn('Single Report data error', response);
                });
            },
            getGroupReport: function () {
                $http({
                    method: 'GET',
                    url: MainConf.servicesUrl() + this.group_report_url,
                    headers: {
                        'Authorization': 'Bearer ' + $scope.token,
                        'Content-Type': 'application/json'
                    }

                }).then(function successCallback(response) {
                    // console.log('Group Report', response);
                    $scope.groupReport = response.data.data.data.report;
                    angular.element(document).ready(function () {
                        var link = document.getElementById('group_report_link');
                        if (link) {
                            link.setAttribute('href', $scope.groupReport);
                        }
                    });
                }, function errorCallback(response) {
                    console.warn('Group Report data error', response);
                });
            },
            openModalSubscriptions: function () {
                var self = this;
                ngDialog.open({
                    template: MainConf.mainAppPath() + '/dashboard/views/modal-subscriptions.html',
                    scope: $scope
                });

                // $rootScope.$on('ngDialog.closed', function (e, $dialog) {
                //     var subscription = $window.localStorage.getItem("subscription");
                //     if (typeof subscription === 'undefined' && subscription === null) {
                //         window.location.reload();
                //     }
                // });

                $rootScope.$on('ngDialog.opened', function (e, $dialog) {
                    $timeout(function() {
                        $('.subscription').animate({ scrollTop: 0 }, 'slow');
                    }, 1000);
                    $scope.addSubscription = function () {
                        var value = subscription_select.value;
                        value = value.replace('string:', '');
                        value = value.replace('number:', '');

                        console.log('ø', value, value === '?');
                        if (value === '?') {
                            $.bigBox({
                                title: 'Please choose value!',
                                //content: question + ", just created also
                                // a new systemic map Item is here for you just to begin.",
                                color: "#C46A69",
                                timeout: 2000,
                                icon: "fa fa-check",
                                number: "1"
                            });
                        } else {
                            $http({
                                method: 'POST',
                                url: MainConf.servicesUrl() + self.subscription_url + value,
                                headers: {
                                    'Authorization': 'Bearer ' + $scope.token,
                                    'Content-Type': 'application/json'
                                }
                            }).then(function successCallback(response) {
                                if (parseInt(response.data.data.code) === 1) {
                                    $window.localStorage.setItem("subscription", value);
                                    console.log('Subscription data success', response);
                                    $timeout(function() {
                                        window.location.reload();
                                    }, 500);
                                } else {
                                    console.log('Subscription data error', response);
                                    $.bigBox({
                                        title: 'Subscription not saved!',
                                        //content: question + ", just created also
                                        // a new systemic map Item is here for you just to begin.",
                                        color: "#C46A69",
                                        timeout: 5000,
                                        icon: "fa fa-check",
                                        number: "1"
                                    });
                                }
                            }, function errorCallback(response) {
                                console.log('Subscription data error', response);
                                $.bigBox({
                                    title: 'Subscription not saved!',
                                    //content: question + ", just created also
                                    // a new systemic map Item is here for you just to begin.",
                                    color: "#C46A69",
                                    timeout: 5000,
                                    icon: "fa fa-check",
                                    number: "1"
                                });
                            });
                            ngDialog.closeAll();
                        }


                    };
                });
            }
        };


        dashboard.data();

    }
).filter('htmlToPlaintext', function () {
        return function (text) {
            return angular.element(text).text();
        }
    }
);
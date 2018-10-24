angular.module('app.dashboard').controller(
    'DashboardCtrl',
    function ($rootScope, $scope, $http, $window, $stateParams, $document, $state, $timeout, MainConf, Auth) {
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

        var dashboard = {
            single_report_url: 'report/single',
            group_report_url: 'report/group',
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
                        self.addTexts($scope.firstProcess);
                        // console.log('dashboard resp', $scope.olsetStatsInfo.count_organizations[0]);

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
                    console.log('user surveys:: ', $scope.olsetSurvey);

                }, function errorCallback(response) {
                    console.warn('Dashboard getAvailableSurveys data error', response);
                    // alert('Dashboard getAvailableSurveys data error');
                    // $scope.olsetProcessData = response.data.process;
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
                    console.log('Single Report', response);
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
                    console.log('Group Report', response);
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
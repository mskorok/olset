angular.module('app.surveys').controller(
    'surveysCtrl',
    function ($scope, $http, $window, $stateParams, $state, $timeout, MainConf, ngDialog) {

        var authToken = $window.localStorage.getItem('authToken');
        $scope.token = authToken;
        $scope.openModaltoAddOrEdit = function (id, title, description, mode, modalName) {
            ngDialog.open({
                template: MainConf.mainAppPath() + '/surveys/views/add-or-edit-view.html',
                scope: $scope
            });
            $scope.surveyData = {
                'id': id,
                'title': title,
                'description': description,
                'isEditable': 1,
                'isOlset': 0
            };
            $scope.modalMode = mode;
            $scope.addOrEditTitle = modalName;
        };

        var datas2 = function () {
            $http({
                method: 'GET',
                url: MainConf.servicesUrl() + 'survey',
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                }

            }).then(function successCallback(response) {
                console.log('Survey data success:', response);
                $scope.surveysData = response.data.data.data;
            }, function errorCallback(response) {
                console.warn('Survey data error', response);
                alert('Survey data error');
            });
        };

        datas2();

        $scope.addSurveyItem = function () {
            console.log('Add Survey Item');

            $http({
                method: 'POST',
                url: MainConf.servicesUrl() + 'survey',
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                },
                data: {
                    'title': $scope.surveyData.title,
                    'description': $scope.surveyData.description,
                    'isEditable': $scope.surveyData.isEditable,
                    'isOlset': $scope.surveyData.isOlset
                }

            }).then(function successCallback(response) {
                console.log('Survey add data success:', response);
                $.bigBox({
                    title: "Survey Added!",
                    color: "#739E73",
                    timeout: 5000,
                    icon: "fa fa-check",
                    number: "1"
                });
                ngDialog.close();
                $timeout(function () {
                    datas2();
                    $scope.$apply();
                }, 2);
                //$state.go('app.sysmap.manager.view.'+$scope.sysMapId);
            }, function errorCallback(response) {
                console.warn('Survey add data error', response);
                alert('Survey add data error');
            });
        };


        $scope.editSurveyItem = function (id) {
            $http({
                method: 'PUT',
                url: MainConf.servicesUrl() + 'survey/' + id,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json'
                },
                data: {
                    //'id':id,
                    'title': $scope.surveyData.title,
                    'description': $scope.surveyData.description,
                    'isEditable': $scope.surveyData.isEditable,
                    'isOlset': $scope.surveyData.isOlset
                }

            }).then(function successCallback(response) {
                console.log('Survey edit data success:', response);
                ngDialog.close();
                $.bigBox({
                    title: "Survey Updated!",
                    color: "#739E73",
                    timeout: 5000,
                    icon: "fa fa-check",
                    number: "1"
                });

                $scope.closedthis = function () {

                    // var des = "sws";
                    /*$.smallBox({
                        title: "Closed!",
                        content: "",
                        color: "#739E73",
                        iconSmall: "fa fa-cloud",
                        timeout: 1000
                    });*/
                };

                $timeout(function () {
                    datas2();
                    //$scope.frameUrl = "http://144.76.5.203/olsetapp/public/sam_view.php?token="
                    // +authToken+"&id="+$scope.sysMapId+"&t="+Date.now()+"";
                    $scope.$apply();
                }, 2);

                // $state.go('app.sysmap.manager.view.'+$scope.sysMapId);
                //$state.go('app.sysmap.manager.view',{"sysMapId": sysmid});

            }, function errorCallback(response) {
                console.warn('Survey edit data error', response);
                alert('Survey edit data error');
            });

        }
    }
);
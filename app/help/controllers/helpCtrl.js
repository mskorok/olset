angular.module('app.help').controller(
    'helpCtrl',
    function ($scope, $http, $window, $stateParams, $state, $timeout, MainConf, ngDialog) {

        $scope.token = $window.localStorage.getItem('authToken');
        $scope.openModaltoAddOrEdit = function (id, title, description, mode, modalName) {
            ngDialog.open({
                template: MainConf.mainAppPath() + '/help/views/help_pop_up_view.html',
                scope: $scope
            });
            $scope.groupData = {
                'id': id,
                'title': title,
                'description': description
            };
            $scope.modalMode = mode;
            $scope.addOrEditTitle = modalName;
        };

    }
);
angular.module('app.olset').controller(
    'olsetOmsCtrl',
    function ($rootScope, $scope, $http, $window, $stateParams, $document, $state, $timeout, MainConf, ngDialog) {
        $scope.token = $window.localStorage.getItem('authToken');
        $scope.processId = $stateParams.processId;
    }
);
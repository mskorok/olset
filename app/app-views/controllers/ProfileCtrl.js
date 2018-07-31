'use strict';

angular.module('app.appViews').controller('ProfileCtrl', function ($scope, $window) {

    $scope.userData = JSON.parse($window.localStorage.getItem('userData'));
    //console.log($scope.userData);
});
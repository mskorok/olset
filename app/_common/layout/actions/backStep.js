"use strict";

angular.module('SmartAdmin.Layout').directive('backStep', function($rootScope, $state){
    return {
        restrict: 'EA',
        link: function (scope, element) {
            element.on('click', function () {
                console.log('rc', $rootScope.previousState.name);
                if ($rootScope.previousState.name === '') {
                    $state.go('app.dashboard', {});
                } else {
                    $state.go($rootScope.previousState, $rootScope.previousStateParams);
                }
            });
        }
    }
});
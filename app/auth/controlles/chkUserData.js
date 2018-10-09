angular.module('app.auth').controller('chkUserData', function ($scope, $window, $state, User, Auth, $location) {

    // console.log('user data = ', $window.localStorage.getItem('userData'));

    $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {
        if (value === oldValue) {
            // console.log("Connect");
        }

        // console.log('theValueO: ', oldValue);

        if (!value) {
            // console.log("Disconnect");
        }

    }, true);

});
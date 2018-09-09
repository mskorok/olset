angular.module('app.auth').factory('User', function ($http, $window, $q, Auth, $rootScope, APP_CONFIG) {

    var dfd = $q.defer();

    var UserModel = {
        initialized: dfd.promise,
        username: undefined,
        picture: undefined
    };


    /*$rootScope.$watch(function() {

		return //value to be watched;

	}, function watchCallback(newValue, oldValue) {

		//react on value change here

	});*/

    $rootScope.$watch(Auth.isLoggedIn, function (value, oldValue) {

        if (value) {

            //if (value != oldValue) {

            var userData = JSON.parse($window.localStorage.getItem('userData'));

            if (userData) {
                UserModel.username = userData.username;
                UserModel.role = userData.role;
                UserModel.email = userData.email;
                UserModel.firstName = userData.firstName;
                UserModel.lastName = userData.lastName;
                UserModel.location = userData.location;
                UserModel.createdAt = userData.createdAt;
                UserModel.updatedAt = userData.updatedAt;
            }
            //}
        }

        console.log('theValueO: ', UserModel);

        if (!value) {

            console.log("Disconnect auth user");

            //$window.location.href = '#/real-login';

        }

    }, true);


    $http.get(APP_CONFIG.apiRootUrl + '/user.json').then(function (response) {
        console.log('user.json', response);
        UserModel.picture = response.data.picture;
        dfd.resolve(UserModel)
    });

    return UserModel;
});
"use strict";


angular.module('app.help').controller('helpCtrl', function ($scope, $http, $window, $stateParams, $state, $timeout, MainConf, ngDialog) {
	
	var authToken = $window.localStorage.getItem('authToken');
	$scope.token = authToken;
	$scope.openModaltoAddOrEdit = function(id, title, description, mode, modalName) {
		ngDialog.open({
		   template: MainConf.mainAppPath() + '/help/views/help_pop_up_view.html',
		   scope: $scope
		});
		$scope.groupData = {
			'id' : id,
			'title' : title,
			'description' : description
		}
		$scope.modalMode = mode;
		$scope.addOrEditTitle = modalName;
	}
	var sysmid;

	// var datas2 = function () {
	// 	$http({
	//
	// 	    method: 'GET',
	// 	    url: MainConf.servicesUrl()+'department',
	// 	    headers: {
	// 		    'Authorization': 'Bearer '+authToken,
	// 		    'Content-Type': 'application/json'
	// 		}
	//
	// 	}).then(function successCallback(response) {
	// 		$scope.departmentsData = response.data.data.data;
	// 	}, function errorCallback(response) {
	//
	// 		//console.log('YOYO');
	//
	// 	});
	// }
	// datas2();

})
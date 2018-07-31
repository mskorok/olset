"use strict";
angular.module('app.surveys').controller('surveysCtrl', function ($scope, $http, $window, $stateParams, $state, $timeout, MainConf, ngDialog) {
	
	var authToken = $window.localStorage.getItem('authToken');
	$scope.token = authToken;
	var sysmid;
	$scope.openModaltoAddOrEdit = function(id, title, description, mode, modalName) {
		ngDialog.open({
		   template: MainConf.mainAppPath() + '/surveys/views/add-or-edit-view.html',
		   scope: $scope
		});
		$scope.surveyData = {
		'id' : id,
		'title' : title,
		'description' : description,
		'isEditable':1,
		'isOlset':0
		}
		$scope.modalMode = mode;
		$scope.addOrEditTitle = modalName;
	}

	var datas2 = function () {	
	 $http({
	 	
	     method: 'GET',
	     url: MainConf.servicesUrl()+'survey',
	     headers: {  
	 	    'Authorization': 'Bearer '+authToken,
	 	    'Content-Type': 'application/json'					    
	 	}
	 
	 }).then(function successCallback(response) {
	 	$scope.surveysData = response.data.data.data;
	 }, function errorCallback(response) {

	 });
	}

	datas2();

	$scope.addSurveyItem = function () {
	
		console.log('call');

		$http({
			
		    method: 'POST',
		    url: MainConf.servicesUrl()+'survey',
		    headers: {  
			    'Authorization': 'Bearer '+authToken,
			    'Content-Type': 'application/json'					    
			},					
			data: {						
				'title':$scope.surveyData.title,
				'description':$scope.surveyData.description,
				'isEditable':$scope.surveyData.isEditable,
				'isOlset':$scope.surveyData.isOlset		
			}
		    
		}).then(function successCallback(response) {
		    $.bigBox({
		        title: "Survey Added!",
		        color: "#739E73",
		        timeout: 5000,
		        icon: "fa fa-check",
		        number: "1"
		    });
		    ngDialog.close();
		    $timeout(function() { 
				datas2();
				$scope.$apply();  
		    }, 2);
		    //$state.go('app.sysmap.manager.view.'+$scope.sysMapId);
		}, function errorCallback(response) {
			
			//console.log('YOYO');
			
		});
		
	}
	
	
	$scope.editSurveyItem = function (id) {
		$http({
			
		    method: 'PUT',
		    url: MainConf.servicesUrl()+'survey/'+id,
		    headers: {  
			    'Authorization': 'Bearer '+authToken,
			    'Content-Type': 'application/json'					    
			},					
			data: {	
				//'id':id,					
				'title':$scope.surveyData.title,
				'description':$scope.surveyData.description,
				'isEditable':$scope.surveyData.isEditable,
				'isOlset':$scope.surveyData.isOlset	
			}
		    
		}).then(function successCallback(response) {
			ngDialog.close();
		    $.bigBox({
		        title: "Survey Updated!",
		        color: "#739E73",
		        timeout: 5000,
		        icon: "fa fa-check",
		        number: "1"
		    });
		    
		    $scope.closedthis = function() {
			    
			    var desde = "swseew";
		        /*$.smallBox({
		            title: "Closed!",
		            content: "",
		            color: "#739E73",
		            iconSmall: "fa fa-cloud",
		            timeout: 1000
		        });*/
		    };
		    
		    $timeout(function() { 
				datas2();
				//$scope.frameUrl = "http://144.76.5.203/olsetapp/public/sam_view.php?token="+authToken+"&id="+$scope.sysMapId+"&t="+Date.now()+"";
				$scope.$apply();  
		    }, 2);
		    
		   // $state.go('app.sysmap.manager.view.'+$scope.sysMapId);
		    //$state.go('app.sysmap.manager.view',{"sysMapId": sysmid});
		
		}, function errorCallback(response) {
			
			//console.log('YOYO');
			
		});
		
	}
	
	
	/*$scope.deleteDepartment = function(grpid) {
        
		$.SmartMessageBox({
            title: "This move cannot undone!",
            content: "The "+$scope.groupsData.title+" department will be removed, are you sure about that ?",
            buttons: '[No][Yes]'
        }, function (ButtonPressed) {
            if (ButtonPressed === "Yes") {


				$http({
					
				    method: 'DELETE',
				    url: MainConf.servicesUrl()+'department'+grpid,
				    headers: {  
					    'Authorization': 'Bearer '+authToken,
					    'Content-Type': 'application/json'					    
					}
					
				    
				    
				}).then(function successCallback(response) {
						
						//console.log("del: ",response);
						var code = response.data.data.code;
						var title = (code == 1)? "SUCCESS" : "ERROR";
						var color = (code == 1)? "#739E73" : "#d81e1e";
						var icon = (code == 1)? "fa fa-check" : "fa fa-exclamation-triangle";
						
						//Error Logs
				        $.bigBox({
				            title: title,
				            content: response.data.data.status,
				            color: color,
				            timeout: 15000,
				            icon: icon,
				            number: "1"
				        });
				        
				    $timeout(function() { 
						datas2();
						$scope.$apply();  
				    }, 2);
				
				}, function errorCallback(response) {
					
					//console.log('YATSU');
					
				});
				
            }
            if (ButtonPressed === "No") {
                $.smallBox({
                    title: "Callback function",
                    content: "<i class='fa fa-clock-o'></i> <i>Good decision...</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
            }

        });
	}*/
})
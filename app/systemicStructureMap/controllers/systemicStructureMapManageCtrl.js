"use strict";
angular.module('app.systemicStructureMap').controller('systemicStructureMapManageCtrl', function ($scope, $http, $window, $stateParams, $state, $timeout, MainConf, ngDialog) {
	
	var authToken = $window.localStorage.getItem('authToken');
	$scope.token = authToken;
    $scope.processId = $stateParams.processId;
	$scope.openModaltoAddOrEdit = function(id, name, startDate, endDate, processId, mode, modalName) {
		ngDialog.open({
		   template: MainConf.mainAppPath() + '/systemicStructureMap/views/add-or-edit-systemic-structure-map.html',
		   scope: $scope
		});
		$scope.sysStructureData = {
			"id": id,
            "name": name,
            "startDate": new Date(startDate),
            "endDate": new Date(endDate),
            "lang":"en",
            "isActive":1,
            "processId":processId
		}
		$scope.modalMode = mode;
		$scope.addOrEditTitle = modalName;
	}

	var datas2 = function () {	
	 $http({
	 	
	     method: 'GET',
	     url: MainConf.servicesUrl()+'systemicmap/getSystemicStructureMap/' + $scope.processId,
	     headers: {  
	 	    'Authorization': 'Bearer '+authToken,
	 	    'Content-Type': 'application/json'					    
	 	}
	 
	 }).then(function successCallback(response) {
	 	$scope.systemicStructureMapIndex = response.data.data.data;
	 	console.log("systemics get", $scope.systemicStructureMapIndex);
	 }, function errorCallback(response) {

	 });
	}

	datas2();

	$scope.addSysStructureMap = function () {
	
		console.log($scope.sysStructureData);


		$http({
		    method: 'POST',
		    url: MainConf.servicesUrl()+'systemicmap/createSystemicStructureMap',
		    headers: {  
			    'Authorization': 'Bearer '+authToken,
			    'Content-Type': 'application/json'					    
			},
			data: {
                "name":$scope.sysStructureData.name,
                "startDate":$scope.sysStructureData.startDate.toISOString().replace("T", " ").replace("Z",""),
                "endDate":$scope.sysStructureData.endDate.toISOString().replace("T", " ").replace("Z",""),
                "lang":"gr",
                "isActive":1,
                "processId":$scope.sysStructureData.processId
			}
		    
		}).then(function successCallback(response) {
		    $.bigBox({
		        title: "Systemic structure map created!",
		        color: "#739E73",
		        timeout: 5000,
		        icon: "fa fa-check",
		        number: "1"
		    });
		    ngDialog.close();
		    setTimeout(function() {
				datas2();
				$scope.$apply();  
		    }, 2);
		    //$state.go('app.sysmap.manager.view.'+$scope.sysMapId);
		}, function errorCallback(response) {

		});
	}

	$scope.editSysStructureMap = function () {
		$http({
			
		    method: 'PUT',
		    url: MainConf.servicesUrl()+'systemicmap/updateSystemicStructureMap/'+$scope.sysStructureData.id,
		    headers: {  
			    'Authorization': 'Bearer '+authToken,
			    'Content-Type': 'application/json'					    
			},					
			data: {
                "name":$scope.sysStructureData.name,
                "startDate":$scope.sysStructureData.startDate.toISOString().replace("T", " ").replace("Z",""),
                "endDate":$scope.sysStructureData.endDate.toISOString().replace("T", " ").replace("Z",""),
                "lang":"gr",
                "isActive":1,
                "processId":$scope.sysStructureData.processId
			}
		    
		}).then(function successCallback(response) {
			ngDialog.close();
		    $.bigBox({
		        title: "Structure Map Updated!",
		        color: "#739E73",
		        timeout: 5000,
		        icon: "fa fa-check",
		        number: "1"
		    });
		    
		    $scope.closedthis = function() {
			    
			    var desde = "swseew";
		    };
		    
		    setTimeout(function() {
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
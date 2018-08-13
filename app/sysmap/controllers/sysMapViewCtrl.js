"use strict";


angular.module('app.sysmap').controller('sysMapViewCtrl', function ($scope, $http, $window, $stateParams, $document, $state, $sce, $timeout, MainConf) {
	
	var authToken = $window.localStorage.getItem('authToken');
	$scope.token = authToken;
	$scope.sysMapId = $stateParams.sysMapId;
	
	var sysmid;
	$scope.sysMapName = "Systemic Map Items";
	var datas2 = function () {
		$http({
		    method: 'GET',
		    url: MainConf.servicesUrl()+'systemicmap/getItem/'+$scope.sysMapId,
		    headers: {  
			    'Authorization': 'Bearer '+authToken,
			    'Content-Type': 'application/json'					    
			}
		
		}).then(function successCallback(response) {
			
			var sysmapn = response.data.data.data.nodes;
			var i = 0;
			var sysmapl = response.data.data.data.links;
			var finaldatas  = [];
			
			$scope.sysMapItemsData = sysmapn;
				
		}, function errorCallback(response) {

		});
	}
	
	var datas2 = function () {
		$http({

		    method: 'GET',
		    url: MainConf.servicesUrl()+'systemicmap/getItemTree/'+$scope.sysMapId,
		    headers: {
			    'Authorization': 'Bearer '+authToken,
			    'Content-Type': 'application/json'
			}

		}).then(function successCallback(response) {

			$scope.dataToRender = response.data.data.htmlCode;
			var urlSmall = MainConf.servicesUrl()+ "public/sam_view.php?token="
                + authToken + "&id=" + $scope.sysMapId + "&t=" + Date.now() + "&v=0";
			var urlBig = MainConf.servicesUrl() + "public/sam_view.php?token=" + authToken + "&id=" + $scope.sysMapId
                + "&t=" + Date.now() + "&v=1";

            $scope.frameUrl = $sce.trustAsResourceUrl(urlSmall);
            $scope.frameUrl0 = $sce.trustAsResourceUrl(urlBig);

		}, function errorCallback(response) {

		});
	}

	datas2();

	$scope.addSysMapItem = function (sysmid, question, proposal, groupId, color) {
		//var groupId = 2;
		
		$http({
			
		    method: 'POST',
		    url: MainConf.servicesUrl()+'systemicmap/createItem',
		    headers: {  
			    'Authorization': 'Bearer '+authToken,
			    'Content-Type': 'application/json'					    
			},					
			data: {						
				'systemic_map_id':$scope.sysMapId,
				'question':question,
				'proposal':proposal,
				'from_item':sysmid,	
				'groupId': groupId,
				'color' : color		
			}
		    
		}).then(function successCallback(response) {
			
		    $.bigBox({
		        title: "Systemic Map Item Ready!",
		        //content: question + ", just created also a new systemic map Item is here for you just to begin.",
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
				$scope.$apply();  
		    }, 2);
		    //$state.go('app.sysmap.manager.view.'+$scope.sysMapId);
		}, function errorCallback(response) {
			
			console.log('YOYO');
			
		});
	}
	
	$scope.editSysMapItem = function (sysmid, question, proposal, groupId) {
		///var groupId = 2;
		$http({
			
		    method: 'PUT',
		    url: MainConf.servicesUrl()+'systemicmap/item/'+sysmid,
		    headers: {  
			    'Authorization': 'Bearer '+authToken,
			    'Content-Type': 'application/json'					    
			},					
			data: {						
				'question':question,
				'proposal':proposal,
				'groupId': groupId,
				//'color' : color		
			}
		    
		}).then(function successCallback(response) {
			
		    $.bigBox({
		        title: "Systemic Map Updated!",
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

		}, function errorCallback(response) {

			console.log('YOYO');
		});
	}
	
	$scope.deleteSysMapItem = function(sysmid) {
		
		$.SmartMessageBox({
            title: "This move cannot undone!",
            content: "The Systemic Map Item will be removed, are you sure about this ?",
            buttons: '[No][Yes]'
        }, function (ButtonPressed) {
        
        	if (ButtonPressed === "Yes") {

				$http({
					
				    method: 'DELETE',
				    url: MainConf.servicesUrl()+'systemicmap/item/'+sysmid,
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

						var dialog_arr = document.getElementsByClassName("divMessageDialog");
						
						console.log("Dialog:: ", dialog_arr);

				        $.bigBox({
				            title: title,
				            content: response.data.data.status,
				            color: color,
				            timeout: 15000,
				            icon: icon,
				            number: "1"
				        });
				        
				    //$timeout(function() { 
						datas2();
						$scope.$apply();  
						//return 0;
				   // }, 4);
				
				}, function errorCallback(response) {

				});
				$("#MsgBoxBack").removeClass("fadeIn").addClass("fadeOut").delay(300).queue(function(){ExistMsg=0,$(this).remove()});
				
            }
            if (ButtonPressed === "No") {

                $.smallBox({
                    title: "Your items are on place",
                    content: "<i class='fa fa-clock-o'></i> <i>Good decision...</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                $("#MsgBoxBack").removeClass("fadeIn").addClass("fadeOut").delay(300).queue(function(){ExistMsg=0,$(this).remove()});

            }
        });
	}
})
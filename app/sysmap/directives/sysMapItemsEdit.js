'use strict';

angular.module('app.sysmap').directive('sysMapItemsEdit', function () {
    return {
	    
		restrict: 'EA',
        scope: {
            datasp: '=?datasp',
            editFunc: '&editFunc',
            handler: '=?lolo',
            //dataprop: '=dataprop',
            //dataque : '=dataque',
            //datagrp: '=datagrp',
            //dataclr: '=dataclr'
        },
        template: '<div class="modal fade" id="myModal{{datasp}}E" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel">Edit item</h4></div><div class="modal-body"><div class="row"><div class="col-md-12"><div class="form-group"><label style="color: #888;font-size: 14px;">Question</label><input type="text" class="form-control" ng-model="sysMapData.question" name="question" required /></div><div class="form-group"><label style="color: #888;font-size: 14px;">Action</label><input type="text" class="form-control" ng-model="sysMapData.proposal" name="proposal" required /></div><div class="form-group"><label class="labelfi">Group</label><select class="selectpicker" ng-model="sysMapData.group"><option ng-repeat="group in groupsData" value={{group.id}}>{{group.title}}</option></select></div></div></div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button><button type="button" ng-click="editItem()" data-dismiss="modal" class="btn btn-primary">Edit Item</button></div></div></div></div>',
        transclude: true,
        link: function (scope, element, attributes) {
	        scope.dataque = attributes.dataque;
	        scope.dataprop = attributes.dataprop;
	        scope.datagrp = attributes.datagrp;
            scope.sysMapData = {
				'question' : attributes.dataque,
				'proposal' : attributes.dataprop,
				'group' : attributes.datagrp,
		 	} 
		 	
		 	
		    scope.editItem  = function ($modalInstance) {
			    
				scope.editFunc({sysmid: scope.datasp, question: scope.sysMapData.question, proposal: scope.sysMapData.proposal, group: scope.sysMapData.group, color: scope.sysMapData.color});

		    };

			
        },
        controller: function ($scope, $window, $http) {

		 		
			var authToken = $window.localStorage.getItem('authToken');
					
				//$timeout(function() { 
				var datas2 = function () {	
					
				$http({
				
					method: 'GET',
					url: 'http://144.76.5.203/olsetapp/group',
					headers: {  
					    'Authorization': 'Bearer '+authToken,
					    'Content-Type': 'application/json'					    
					}
					
				}).then(function successCallback(response) {
					
					$scope.groupsData = response.data.data.data;
				}, function errorCallback(response) {
						
					//console.log('YOYO');
						
				});
			}
				 
		    //}, 0);
		    
		    datas2();
		 		
		 		
		 			
		 		
        },
    }
});
'use strict';

angular.module('app.sysmap').directive('sysMapItemsAdd', function () {
    return {
	    
		restrict: 'EA',
        scope: {
            datasp: '=?datasp',
            addFunc: '&addFunc',
            handler: '=?lolo'
        },
        template: '<div class="modal fade" id="myModal{{datasp}}C" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel">Add new item</h4></div><div class="modal-body"><div class="row"><div class="col-md-12"><div class="form-group"><input type="text" class="form-control" ng-model="sysMapData.question" name="question" placeholder="Question" required /></div><div class="form-group"><input type="text" class="form-control" ng-model="sysMapData.proposal" name="proposal" placeholder="Action" required /></div><div class="form-group"><label class="labelfi">Group</label><select class="selectpicker" ng-model="sysMapData.group"><option ng-repeat="group in groupsData" value={{group.id}} >{{group.title}}</option></select></div></div></div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button><button type="button" ng-click="addItem()" data-dismiss="modal" class="btn btn-primary">Add Item</button></div></div></div></div>',
        transclude: true,
        link: function (scope, element, attributes) {
            scope.sysMapData = {
				'question' : '',
				'proposal' : '',
				'group' : '',
		 	} 
		 	
		    scope.addItem  = function () {
			    
				scope.addFunc({sysmid: scope.datasp, question: scope.sysMapData.question, proposal: scope.sysMapData.proposal, group: scope.sysMapData.group, color: scope.sysMapData.color });

		    };

			
        },
        controller: function ($scope, $window, $http) {

		 		
			var authToken = $window.localStorage.getItem('authToken');
					
				//$timeout(function() { 
				var datas2 = function () {	
					
				$http({
				
					method: 'GET',

                    url: MainConf.servicesUrl() + 'group',
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
'use strict';

angular.module('app.departments').directive('departmentItemAdd', function () {
    return {
	    
		restrict: 'EA',
        scope: {
            addFunc: '&addFunc',
        },
        template: '<div class="modal fade" id="myModalC" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel">Create Department</h4></div><div class="modal-body"><div class="row"><div class="col-md-12"><div class="form-group"><input type="text" class="form-control" ng-model="departmentData.title" name="title" placeholder="Department Title" required /></div><div class="form-group"><input type="text" class="form-control" ng-model="departmentData.description" name="Description" placeholder="Description" required /></div></div></div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button><button type="button" ng-click="addItem()" data-dismiss="modal" class="btn btn-primary">Add Department</button></div></div></div></div>',
        transclude: true,
        link: function (scope, element, attributes) {
	        
            scope.departmentData = {
				'title' : '',
				'description' : ''
		 	} 
		 	//ELEMENT.classList.remove("CLASS_NAME");
		 	
		    scope.addItem  = function () {
			    console.log('Patithika');
				
				//scope.$apply(function(){
					scope.addFunc({title: scope.departmentData.title, description: scope.departmentData.description});
				//});
		    };

			
        }
    }
});
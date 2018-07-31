'use strict';

angular.module('app.sysmap').directive('sysMapRender', function ($compile, $parse, $timeout) {
	return {
      restrict: 'EA',
      link: function(scope, element, attributes) {
	      
        scope.$watch(attributes.content, function() {
	        
	        
		    element.html($parse(attributes.content)(scope));
		    $compile(element.contents())(scope); 
		    console.log($compile(element.contents())(scope));
		    

        }, true);
      }
    }
});
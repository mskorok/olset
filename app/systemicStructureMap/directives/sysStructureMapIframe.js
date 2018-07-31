'use strict';

angular.module('app.systemicStructureMap').directive('sysStructureMapIframe', function ($compile, $parse, $timeout) {
	return {
      restrict: 'EA',
	  scope: {
		  theurl: '=theurl',
		  state: '=state'
	  },
      template: '<iframe style="width:100%; height: 1000px; border:0px; margin-top: 6px;" ng-src="{{theurl}}"></iframe>',
      link: function(scope, element, attributes) {

      }
    }
});
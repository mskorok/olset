angular.module('app.ssm').directive('sysStructMapIframe', function ($compile, $parse, $timeout) {
    return {
        restrict: 'EA',
        scope: {
            theurl: '=theurl',
            state: '=state'
        },
        template: '<iframe style="width: 100%; height: 1000px; border: 0; margin-top: 6px;"' +
        ' data-ng-src="{{theurl}}"></iframe>',
        link: function (scope, element, attributes) {

        }
    }
});
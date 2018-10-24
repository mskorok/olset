angular.module('app.ssm').directive('sysStructMapRender', function ($compile, $parse, $timeout) {
    return {
        restrict: 'EA',
        link: function (scope, element, attributes) {

            scope.$watch(attributes.content, function () {
                element.html($parse(attributes.content)(scope));
                $compile(element.contents())(scope);
                console.log('sysMapRender attributes watch: ', $compile(element.contents())(scope));

            }, true);
        }
    }
});
angular.module('app.ssm').directive('sysStructMaptreeContent', function ($compile) {
    return {
        restrict: 'E',
        link: function (scope, element) {
            var $content = $(scope.item.content);

            function handleExpanded() {
                $content.find('>i')
                    .toggleClass('fa-plus-circle', !scope.item.expanded)
                    .toggleClass('fa-minus-circle', !!scope.item.expanded)

            }


            if (scope.item.children && scope.item.children.length) {
                $content.on('click', function () {
                    scope.$apply(function () {
                        scope.item.expanded = !scope.item.expanded;
                        handleExpanded();
                    });
                });
                handleExpanded();
            }

            element.replaceWith($content);


        }
    }
});
angular.module('app.ssm').directive('sysStructMaptree', function ($compile, $sce) {
    return {
        restrict: 'A',
        scope: {
            'items': '='
        },
        template: '<a class="fa fa-lg fa-trash-o" data-ng-click="testScope()"></a>' +
        '<li data-ng-class="{parent_li: item.children.length}" data-ng-repeat="item in items" role="treeitem">' +
        '<sys-struct-maptree-content></sys-struct-maptree-content>' +
        '<ul data-ng-if="item.children.length" smart-treeview data-ng-show="item.expanded"' +
        '  items="item.children" role="group" class="smart-treeview-group" ></ul>' +
        '</li>',
        compile: function (element) {

            // Break the recursion loop by removing the contents
            var contents = element.contents().remove();
            var compiledContents;
            var neededCont;


            return {

                post: function (scope, element) {
                    neededCont = element.find('.fa-trash-o');
                    neededCont.attr('data-ng-click', 'testScope()');
                    // Compile the contents
                    if (!compiledContents) {
                        compiledContents = $compile(contents);
                    }

                    // Re-add the compiled contents to the element
                    compiledContents(scope, function (clone) {
                        element.append(clone);
                    });

                    console.log('element', element);
                }
            };
        }
        /*link: function(scope, element) {
	        //$scope.clickFunctions = {};
	        var childElement = '<button ng-click="clickFunc()">CLICK</button>';
	        element.append(childElement);
	        $compile(element.contents())(scope);

	        scope.clickFunc = function() {
	          alert('Hello, world!');
	        };
      	}*/
    };
});
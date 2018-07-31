'use strict';

angular.module('app.sysmap').directive('sysMaptreeContent', function ($compile) {
    return {
        restrict: 'E',
        link: function (scope, element) {
            var $content = $(scope.item.content);

            function handleExpanded(){
                $content.find('>i')
                    .toggleClass('fa-plus-circle', !scope.item.expanded)
                    .toggleClass('fa-minus-circle', !!scope.item.expanded)

            }


            if (scope.item.children && scope.item.children.length) {
                $content.on('click', function(){
                    scope.$apply(function(){
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
//<a ng-click="testScope()">MUT ME QEP</a>
angular.module('app.sysmap').directive('sysMaptree', function ($compile, $sce) {
    return {
        restrict: 'A',
        scope: {
            'items': '='
        },
        template: '<a class="fa fa-lg fa-trash-o" ng-click="testScope()"></a><li ng-class="{parent_li: item.children.length}" ng-repeat="item in items" role="treeitem">' +
            '<sys-maptree-content></sys-maptree-content>' +
            '<ul ng-if="item.children.length" smart-treeview ng-show="item.expanded"  items="item.children" role="group" class="smart-treeview-group" ></ul>' +
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
        },
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
angular.module('app.survdefs').directive('survdefItemEdit', function () {
    return {

        restrict: 'EA',
        scope: true,
        template: '<div class="modal fade" id="myModal1E" tabindex="-1" role="dialog"' +
        ' aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog">' +
        '<div class="modal-content"><div class="modal-header"><button type="button" class="close"' +
        ' data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title"' +
        ' id="myModalLabel">Create Group</h4></div><div class="modal-body">' +
        '<div class="row"><div class="col-md-12"><div class="form-group">' +
        '<input type="text" class="form-control" ng-model="groupData.title" name="title"' +
        ' placeholder="Group Title" required /></div><div class="form-group">' +
        '<label style="color: #888;font-size: 12px;">Color</label>' +
        '<input type="color" class="form-control" data-ng-model="groupData.color" name="color" required />' +
        '</div></div></div></div><div class="modal-footer">' +
        '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
        '<button type="button" data-ng-click="addItem()" data-dismiss="modal"' +
        ' class="btn btn-primary">Add Group</button>' +
        '</div></div></div></div>',
        transclude: true,
        link: function (scope, element, attributes) {
            //var groupd = scope.$$nextSibling.group;
            scope.survdefData = {
                'title': '',
                'color': ''
            };

            scope.addItem = function () {// todo strange function
                console.log('survdefItemEdit addItem: ', scope.$$nextSibling);
                //scope.$apply(function(){
                //	scope.addFunc({title: scope.group.title, color: scope.group.color});
                //});
            };


        }
    }
});
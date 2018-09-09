angular.module('app.surveys').directive('surveyItemAdd', function () {
    return {

        restrict: 'EA',
        scope: {
            addFunc: '&addFunc'
        },
        template: '<div class="modal fade" id="myModalC" tabindex="-1" role="dialog"' +
        ' aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog">' +
        '<div class="modal-content"><div class="modal-header"><button type="button" class="close"' +
        ' data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title"' +
        ' id="myModalLabel">Create a new survey</h4></div><div class="modal-body">' +
        '<div class="row"><div class="col-md-12"><div class="form-group">' +
        '<input type="text" class="form-control" ng-model="surveyData.title" name="title" placeholder="Survey Title"' +
        ' required /></div><div class="form-group"><input type="text" class="form-control"' +
        ' data-ng-model="surveyData.description" name="Description" placeholder="Description" required />' +
        '</div></div></div></div><div class="modal-footer"><button type="button" class="btn btn-default"' +
        ' data-dismiss="modal">Cancel</button><button type="button" data-ng-click="addItem()"' +
        ' data-dismiss="modal" class="btn btn-primary">Add Survey</button></div></div></div></div>',
        transclude: true,
        link: function (scope, element, attributes) {

            scope.surveyData = {
                'title': '',
                'description': '',
                'isEditable': 1,
                'isOlset': 0
            };

            scope.addItem = function () {
                console.log('Patithika');

                scope.addFunc({
                    title: scope.surveyData.title,
                    description: scope.surveyData.description,
                    isEditable: scope.surveyData.isEditable,
                    isOlset: scope.surveyData.isOlset
                });
            };


        }
    }
});
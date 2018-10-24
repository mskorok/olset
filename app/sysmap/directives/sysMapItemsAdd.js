angular.module('app.sysmap').directive('sysMapItemsAdd', function (MainConf) {
    return {

        restrict: 'EA',
        scope: {
            datasp: '=?datasp',
            addFunc: '&addFunc',
            handler: '=?lolo'
        },
        template: '<div class="modal fade" id="myModal{{datasp}}C" tabindex="-1"' +
        ' role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
        '<div class="modal-dialog"><div class="modal-content"><div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
        '<h4 class="modal-title" id="myModalLabel">Add new item</h4></div><div class="modal-body">' +
        '<div class="row"><div class="col-md-12"><div class="form-group"><input type="text" class="form-control"' +
        ' data-ng-model="sysMapData.question" name="question" placeholder="Question" required />' +
        '</div><div class="form-group"><input type="text" class="form-control" data-ng-model="sysMapData.proposal"' +
        ' name="proposal" placeholder="Action" required /></div><div class="form-group">' +
        '<label class="labelfi">Group</label><select class="selectpicker" data-ng-model="sysMapData.group">' +
        '<option data-ng-repeat="group in groupsData" value={{group.id}} style="color: grey !important;">' +
        '{{group.title}}</option></select></div>' +
        '</div></div></div><div class="modal-footer"><button type="button" class="btn btn-default"' +
        ' data-dismiss="modal">Cancel</button><button type="button" data-ng-click="addSysMapItem()" data-dismiss="modal"' +
        ' class="btn btn-primary">Add Item</button></div></div></div></div>',
        transclude: true,
        link: function (scope, element, attributes) {
            scope.sysMapData = {
                'question': '',
                'proposal': '',
                'group': ''
            };

            scope.addSysMapItem = function () {

                scope.addFunc({
                    sysmid: scope.datasp,
                    question: scope.sysMapData.question,
                    proposal: scope.sysMapData.proposal,
                    group: scope.sysMapData.group,
                    color: scope.sysMapData.color
                });

            };


        },
        controller: function ($scope, $window, $http) {


            var authToken = $window.localStorage.getItem('authToken');

            var datas2 = function () {

                $http({

                    method: 'GET',

                    url: MainConf.servicesUrl() + 'group',
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                        'Content-Type': 'application/json'
                    }

                }).then(function successCallback(response) {
                    console.log('SysMap group data success', response);
                    $scope.groupsData = response.data.data.data;
                }, function errorCallback(response) {
                    console.warn('SysMap group data error', response);
                    alert('SysMap group data error');
                });
            };
            datas2();
        }
    }
});
angular.module('app.sysmap').directive('sysMapItemsEdit', function (MainConf) {
    return {

        restrict: 'EA',
        scope: {
            datasp: '=?datasp',
            editFunc: '&editFunc',
            handler: '=?lolo'
            //dataprop: '=dataprop',
            //dataque : '=dataque',
            //datagrp: '=datagrp',
            //dataclr: '=dataclr'
        },
        template: '<div class="modal fade" id="myModal{{datasp}}E" tabindex="-1" role="dialog"' +
        ' aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog">' +
        '<div class="modal-content"><div class="modal-header"><button type="button" class="close"' +
        ' data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title"' +
        ' id="myModalLabel">Edit item</h4></div><div class="modal-body">' +
        '<div class="row"><div class="col-md-12"><div class="form-group">' +
        '<label style="color: #888;font-size: 14px;">Question</label>' +
        '<input type="text" class="form-control" data-ng-model="sysMapData.question"' +
        ' name="question" required /></div><div class="form-group"><label style="color: #888;' +
        'font-size: 14px;">Action</label><input type="text" class="form-control" data-ng-model="sysMapData.proposal"' +
        ' name="proposal" required /></div><div class="form-group"><label class="labelfi">Group</label>' +
        '<select class="selectpicker" data-ng-model="sysMapData.group"><option data-ng-repeat="group in groupsData"' +
        ' value={{group.id}} style="color: grey !important;">{{group.title}}</option></select></div></div></div></div>' +
        '<div class="modal-footer"><button type="button" class="btn btn-default"' +
        ' data-dismiss="modal">Cancel</button><button type="button" data-ng-click="editItem()" data-dismiss="modal"' +
        ' class="btn btn-primary">Edit Item</button></div></div></div></div>',
        transclude: true,
        link: function (scope, element, attributes) {
            scope.dataque = attributes.dataque;
            scope.dataprop = attributes.dataprop;
            scope.datagrp = attributes.datagrp;
            scope.sysMapData = {
                'question': attributes.dataque,
                'proposal': attributes.dataprop,
                'group': attributes.datagrp
            };


            scope.editItem = function () {//todo strange function

                scope.editFunc({
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
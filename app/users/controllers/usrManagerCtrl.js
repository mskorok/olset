angular.module('app.users').controller('usrManagerCtrl', function ($scope, $http, $window, $state, DTOptionsBuilder, DTColumnBuilder, MainConf, ngDialog) {

    var authToken = $window.localStorage.getItem('authToken');

    var datas = function () {

        $http({
            method: 'GET',
            url: MainConf.servicesUrl() + 'users',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json'
            }

        }).then(function successCallback(response) {
            console.log(response);
            $scope.usersData = response.data.users;
        }, function errorCallback(response) {

        });

    }

    datas();

    this.standardOptions = DTOptionsBuilder
        .fromSource(JSON.stringify($scope.usersData))
         //Add Bootstrap compatibility
        .withDOM("<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-12 hidden-xs'l>r>" +
            "t" +
            "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>")
        .withBootstrap();
    this.standardColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID').withClass('text-danger'),
        DTColumnBuilder.newColumn('firstName').withTitle('Name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Surname'),
        DTColumnBuilder.newColumn('location').withTitle('Location'),
        DTColumnBuilder.newColumn('role').withTitle('Role'),
        DTColumnBuilder.newColumn('email').withTitle('Email'),
        DTColumnBuilder.newColumn('username').withTitle('Username')
    ];

    $scope.deleteUser = function(grpid) {

        $.SmartMessageBox({
            title: "Please think twice...",
            content: "The user will be deleted permanently, are you sure about that ?",
            buttons: '[No][Yes]'
        }, function (ButtonPressed) {
            if (ButtonPressed === "Yes") {


                $http({

                    method: 'DELETE',
                    url: MainConf.servicesUrl()+'users/deactivateOtherUser/'+grpid,
                    headers: {
                        'Authorization': 'Bearer '+authToken,
                        'Content-Type': 'application/json'
                    }



                }).then(function successCallback(response) {

                    //console.log("del: ",response);
                    var code = response.data.data.code;
                    var title = (code == 1)? "SUCCESS" : "ERROR";
                    var color = (code == 1)? "#739E73" : "#d81e1e";
                    var icon = (code == 1)? "fa fa-check" : "fa fa-exclamation-triangle";

                    //Error Logs
                    $.bigBox({
                        title: title,
                        content: response.data.data.status,
                        color: color,
                        timeout: 15000,
                        icon: icon,
                        number: "1"
                    });

                    setTimeout(function() {
                        datas();
                        $scope.$apply();
                    }, 2);

                }, function errorCallback(response) {

                    alert("an error occured");

                });

            }
            if (ButtonPressed === "No") {
                $.smallBox({
                    title: "Quick Notification",
                    content: "<i class='fa fa-clock-o'></i> <i>Good decision...</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
            }

        });
    }

})
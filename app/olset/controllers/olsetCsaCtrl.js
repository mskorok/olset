angular.module('app.olset').controller(
    'olsetCsaCtrl',
    function ($rootScope, $scope, $http, $window, $stateParams, $document, $state, $timeout, MainConf, ngDialog) {
        $scope.token = $window.localStorage.getItem('authToken');
        $scope.processId = $stateParams.processId;
        $(document).ready(function () {
            $('[data-toggle="tooltip"]').tooltip();
            // Add minus icon for collapse element which is open by default
            $(".collapse.in").each(function () {
                $(this).siblings(".panel-heading").find(".glyphicon")
                    .addClass("glyphicon-minus").removeClass("glyphicon-plus");
            });
            // Toggle plus minus icon on show hide of collapse element
            $(".collapse").on('show.bs.collapse', function () {
                $(this).parent().find(".glyphicon").removeClass("glyphicon-plus").addClass("glyphicon-minus");
            }).on('hide.bs.collapse', function () {
                $(this).parent().find(".glyphicon").removeClass("glyphicon-minus").addClass("glyphicon-plus");
            });
        });
    }
);
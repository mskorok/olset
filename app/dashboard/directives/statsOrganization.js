angular.module('app.dashboard').directive('statsOrganization', function () {
    return {
        restrict: 'EA',
        scope: {
            countorgstop: '=countorgstop',
            countorgrun: '@countorgrun'
        },
        transclude: true,
        link: function (scope, element, attrs) {
            attrs.$observe('countorgrun', function (value) {
                // console.log('cnt__', scope.countorgrun);
                if (value) {
                    var finalJson = JSON.parse(scope.countorgrun);
                    console.log('dashboard final json', finalJson);
                    var doughnutOptions = {
                        //Boolean - Whether we should show a stroke on each segment
                        segmentShowStroke: true,
                        //String - The colour of each segment stroke
                        segmentStrokeColor: "#fff",
                        //Number - The width of each segment stroke
                        segmentStrokeWidth: 2,
                        //Number - The percentage of the chart that we cut out of the middle
                        percentageInnerCutout: 50, // This is 0 for Pie charts
                        //Number - Amount of animation steps
                        animationSteps: 100,
                        //String - Animation easing effect
                        animationEasing: "easeOutBounce",
                        //Boolean - Whether we animate the rotation of the Doughnut
                        animateRotate: true,
                        //Boolean - Whether we animate scaling the Doughnut from the centre
                        animateScale: false,
                        //Boolean - Re-draw chart on page resize
                        responsive: true,
                        //String - A legend template
                        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\">" +
                        "<% for (var i=0; i<segments.length; i++){%><li>" +
                        "<span style=\"background-color:<%=segments[i].fillColor%>\"></span>" +
                        "<%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
                    };

                    var doughnutData = [
                        {
                            value: finalJson.count_users[0].count,
                            color: "rgba(220,220,220,0.8)",
                            highlight: "rgba(220,220,220,0.7)",
                            label: "Manager"
                        },
                        {
                            value: finalJson.count_users[1].count,
                            color: "rgba(151,187,205,1)",
                            highlight: "rgba(151,187,205,0.8)",
                            label: "User"
                        }
                    ];


                    // render chart
                    var ctx = element[0].getContext("2d");
                    new Chart(ctx).Doughnut(doughnutData, doughnutOptions);
                }
            });

            // attr.$observe('countorgrun', function(actual_value) {

            //})
            // var theRealDeal = null;
            // // $attr.$observe('chartdata', function(value) {
            // //
            // //     theRealDeal = value;
            // //     console.log("ku je mor chart ?? ", theRealDeal);
            // // });
            //
            //
        }
    }
});
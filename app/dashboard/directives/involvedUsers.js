angular.module('app.dashboard').directive('involvedUsers', function () {
    return {
        restrict: 'EA',
        scope: {
            countorgstop: '=countorgstop',
            involved: '@involved'
        },
        transclude: true,
        link: function (scope, element, attrs) {
            attrs.$observe('involved', function (value) {
                if (value) {
                    var finalJson = JSON.parse(scope.involved);
                    console.log('involved', finalJson);
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
                            value: parseInt(finalJson*100),
                            color: "rgba(220,220,220,0.8)",
                            highlight: "rgba(220,220,220,0.7)",
                            label: "Involved"
                        },
                        {
                            value: 100 - parseInt(finalJson*100),
                            color: "rgba(151,187,205,1)",
                            highlight: "rgba(151,187,205,0.8)",
                            label: "Not involved"
                        }
                    ];

                    // render chart
                    var ctx = element[0].getContext("2d");
                    new Chart(ctx).Doughnut(doughnutData, doughnutOptions);
                }
            });
        }
    }
});
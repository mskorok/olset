angular.module('app.dashboard').directive('processesStatus', function () {
    return {
        restrict: 'EA',
        scope: {
            countorgstop: '=countorgstop',
            status: '@status'
        },
        transclude: true,
        link: function (scope, element, attrs) {
            attrs.$observe('status', function (value) {
                if (value) {
                    var finalJson = JSON.parse(scope.status);
                    // console.log('ps - finalJSON' , finalJson.process === null);
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

                    if (finalJson.process !== null) {
                        var doughnutData = [
                            {
                                value: finalJson.running,
                                color: "rgba(220,220,220,0.8)",
                                highlight: "rgba(220,220,220,0.7)",
                                label: "Running"
                            },
                            {
                                value: finalJson.stopped,
                                color: "rgba(151,187,205,1)",
                                highlight: "rgba(151,187,205,0.8)",
                                label: "Stopped"
                            }
                        ];

                        // render chart
                        var ctx = element[0].getContext("2d");
                        new Chart(ctx).Doughnut(doughnutData, doughnutOptions);
                    } else {
                        var container = $(element).get(0).closest('div.jarviswidget');
                        if (container) {
                            container.style.display = 'none';
                        }
                    }

                }
            });
        }
    }
});
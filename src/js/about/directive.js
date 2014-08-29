angular.module('uiRouterSample')
    .directive('barsChart', function($parse) {
        //explicitly creating a directive definition variable
        //this may look verbose but is good for clarification purposes
        //in real life you'd want to simply return the object {...}
        var directiveDefinitionObject = {
            //We restrict its use to an element
            //as usually  <bars-chart> is semantically
            //more understandable
            restrict: 'E',
            //this is important,
            //we don't want to overwrite our directive declaration
            //in the HTML mark-up
            replace: false,
            //our data source would be an array
            //passed thru chart-data attribute
            scope: {
                data: '=chartData'
            },
            link: function(scope, element, attrs) {
                //in D3, any selection[0] contains the group
                //selection[0][0] is the DOM node
                //but we won't need that this time
                var chart = d3.select(element[0]);
                //to our original directive markup bars-chart
                //we add a div with out chart stling and bind each
                //data entry to the chart
                chart.append("div").attr("class", "chart")
                    .selectAll('div')
                    .data(scope.data).enter().append("div")
                    .transition().ease("elastic")
                    .style("width", (d => d + "%"))
                    .text((d => d + "%"))
                //a little of magic: setting it's width based
                //on the data value (d) 
                //and text all with a smooth transition
                scope.$watch('data', function(newVal, oldVal) {
                    if (newVal === oldVal) {
                        console.log("Changed 1")
                        return;
                    }
                    if (newVal) {
                        chart.selectAll("div")
                            .filter(function(d, i) {
                                if (i == 0) {
                                    return false
                                }
                                return true;
                            })
                            .data(scope.data)
                            .style("width", (d => d + "%"))
                            .text((d => d + "%"))
                    } else {
                        console.log("Changed 3")
                    }
                }, true)

                function transitionGroup() {
                    chart.selectAll()

                }
            }
        };
        return directiveDefinitionObject;
    })
    .directive('donutChart', function($parse) {
        //explicitly creating a directive definition variable
        //this may look verbose but is good for clarification purposes
        //in real life you'd want to simply return the object {...}
        var directiveDefinitionObject = {
            //We restrict its use to an element
            //as usually  <bars-chart> is semantically
            //more understandable
            restrict: 'E',
            //this is important,
            //we don't want to overwrite our directive declaration
            //in the HTML mark-up
            replace: false,
            //our data source would be an array
            //passed thru chart-data attribute
            scope: {
                data: '=chartData'
            },
            link: function(scope, element, attrs) {
                //in D3, any selection[0] contains the group
                //selection[0][0] is the DOM node
                //but we won't need that this time
                // var chart = d3.select(element[0]);
                // var dataset = {
                //     apples: [53245, 28479, 19697, 24037, 40245],
                // };

                var width = 960,
                    height = 500,
                    radius = Math.min(width, height) / 2;

                var color = d3.scale.ordinal()
                    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

                var arc = d3.svg.arc()
                    .outerRadius(radius - 10)
                    .innerRadius(radius - 70);

                var pie = d3.layout.pie()
                    .sort(null)
                    .value(function(d) {
                        return d.population;
                    });

                var svg = d3.select(element[0]).append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                // d3.csv("data.csv", function(error, data) {

                // scope.data.forEach(function(d) {
                //     d.population = +d.population;
                // });

                var g = svg.selectAll(".arc")
                    .data(pie(scope.data))
                    .enter().append("g")
                    .attr("class", "arc");

                g.append("bubbles")
                    .attr("d", arc);

                // g.append("text")
                //     .attr("transform", function(d) {
                //         return "translate(" + arc.centroid(d) + ")";
                //     })
                //     .attr("dy", ".35em")
                //     .style("text-anchor", "middle")
                //     .text(function(d) {
                //         return d.data.age;
                //     });

                // });

            }
        };
        return directiveDefinitionObject;
    });

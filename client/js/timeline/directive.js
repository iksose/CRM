angular.module('uiRouterSample')
.directive( 'crD3Bars', [
  function () {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function (scope, element) {
        // var margin = {top: 20, right: 20, bottom: 30, left: 40},
        //   width = 480 - margin.left - margin.right,
        //   height = 360 - margin.top - margin.bottom;
        // var svg = d3.select(element[0])
        //   .append("svg")
        //   .attr('width', width + margin.left + margin.right)
        //   .attr('height', height + margin.top + margin.bottom)
        //   .append("g")
        //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        //
        // var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
        // var y = d3.scale.linear().range([height, 0]);
        //
        // var xAxis = d3.svg.axis()
        //     .scale(x)
        //     .orient("bottom");
        //
        // var yAxis = d3.svg.axis()
        //     .scale(y)
        //     .orient("left")
        //     .ticks(10);

        //Render graph based on 'data'
        scope.render = function(data) {
          var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
                11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

            d3.select("barchart").selectAll("div")
                .data(dataset)
                .enter()
                .append("div")
                .attr("class", "bar")
                .style("height", function(d) {
                    var barHeight = d * 5;
                    return barHeight + "px";
                });
        };

         //Watch 'data' and run scope.render(newVal) whenever it changes
         //Use true for 'objectEquality' property so comparisons are done on equality and not reference
          scope.$watch('data', function(){
              scope.render(scope.data);
          }, true);
        }
    };
  }
]);

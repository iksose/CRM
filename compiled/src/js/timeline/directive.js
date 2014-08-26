define([], function() {
  "use strict";
  angular.module('uiRouterSample').directive('crD3Bars', [function() {
    return {
      restrict: 'E',
      scope: {data: '='},
      link: function(scope, element) {
        scope.render = function(data) {
          var dataset = [5, 10, 13, 19, 21, 25, 22, 18, 15, 13, 11, 12, 15, 20, 18, 17, 16, 18, 23, 25];
          d3.select("barchart").selectAll("div").data(dataset).enter().append("div").attr("class", "bar").style("height", function(d) {
            var barHeight = d * 5;
            return barHeight + "px";
          });
        };
        scope.$watch('data', function() {
          scope.render(scope.data);
        }, true);
      }
    };
  }]);
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvdGltZWxpbmUvZGlyZWN0aXZlLmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsianMvdGltZWxpbmUvZGlyZWN0aXZlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uZGlyZWN0aXZlKCAnY3JEM0JhcnMnLCBbXG4gIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIGRhdGE6ICc9J1xuICAgICAgfSxcbiAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCkge1xuICAgICAgICAvLyB2YXIgbWFyZ2luID0ge3RvcDogMjAsIHJpZ2h0OiAyMCwgYm90dG9tOiAzMCwgbGVmdDogNDB9LFxuICAgICAgICAvLyAgIHdpZHRoID0gNDgwIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQsXG4gICAgICAgIC8vICAgaGVpZ2h0ID0gMzYwIC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG4gICAgICAgIC8vIHZhciBzdmcgPSBkMy5zZWxlY3QoZWxlbWVudFswXSlcbiAgICAgICAgLy8gICAuYXBwZW5kKFwic3ZnXCIpXG4gICAgICAgIC8vICAgLmF0dHIoJ3dpZHRoJywgd2lkdGggKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodClcbiAgICAgICAgLy8gICAuYXR0cignaGVpZ2h0JywgaGVpZ2h0ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20pXG4gICAgICAgIC8vICAgLmFwcGVuZChcImdcIilcbiAgICAgICAgLy8gICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgbWFyZ2luLmxlZnQgKyBcIixcIiArIG1hcmdpbi50b3AgKyBcIilcIik7XG4gICAgICAgIC8vXG4gICAgICAgIC8vIHZhciB4ID0gZDMuc2NhbGUub3JkaW5hbCgpLnJhbmdlUm91bmRCYW5kcyhbMCwgd2lkdGhdLCAuMSk7XG4gICAgICAgIC8vIHZhciB5ID0gZDMuc2NhbGUubGluZWFyKCkucmFuZ2UoW2hlaWdodCwgMF0pO1xuICAgICAgICAvL1xuICAgICAgICAvLyB2YXIgeEF4aXMgPSBkMy5zdmcuYXhpcygpXG4gICAgICAgIC8vICAgICAuc2NhbGUoeClcbiAgICAgICAgLy8gICAgIC5vcmllbnQoXCJib3R0b21cIik7XG4gICAgICAgIC8vXG4gICAgICAgIC8vIHZhciB5QXhpcyA9IGQzLnN2Zy5heGlzKClcbiAgICAgICAgLy8gICAgIC5zY2FsZSh5KVxuICAgICAgICAvLyAgICAgLm9yaWVudChcImxlZnRcIilcbiAgICAgICAgLy8gICAgIC50aWNrcygxMCk7XG5cbiAgICAgICAgLy9SZW5kZXIgZ3JhcGggYmFzZWQgb24gJ2RhdGEnXG4gICAgICAgIHNjb3BlLnJlbmRlciA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICB2YXIgZGF0YXNldCA9IFsgNSwgMTAsIDEzLCAxOSwgMjEsIDI1LCAyMiwgMTgsIDE1LCAxMyxcbiAgICAgICAgICAgICAgICAxMSwgMTIsIDE1LCAyMCwgMTgsIDE3LCAxNiwgMTgsIDIzLCAyNSBdO1xuXG4gICAgICAgICAgICBkMy5zZWxlY3QoXCJiYXJjaGFydFwiKS5zZWxlY3RBbGwoXCJkaXZcIilcbiAgICAgICAgICAgICAgICAuZGF0YShkYXRhc2V0KVxuICAgICAgICAgICAgICAgIC5lbnRlcigpXG4gICAgICAgICAgICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJiYXJcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJoZWlnaHRcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmFySGVpZ2h0ID0gZCAqIDU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXJIZWlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgIC8vV2F0Y2ggJ2RhdGEnIGFuZCBydW4gc2NvcGUucmVuZGVyKG5ld1ZhbCkgd2hlbmV2ZXIgaXQgY2hhbmdlc1xuICAgICAgICAgLy9Vc2UgdHJ1ZSBmb3IgJ29iamVjdEVxdWFsaXR5JyBwcm9wZXJ0eSBzbyBjb21wYXJpc29ucyBhcmUgZG9uZSBvbiBlcXVhbGl0eSBhbmQgbm90IHJlZmVyZW5jZVxuICAgICAgICAgIHNjb3BlLiR3YXRjaCgnZGF0YScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIHNjb3BlLnJlbmRlcihzY29wZS5kYXRhKTtcbiAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH07XG4gIH1cbl0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
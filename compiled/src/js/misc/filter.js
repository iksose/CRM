define([], function() {
  "use strict";
  angular.module('uiRouterSample').filter('selectedTags', function() {
    return function(tasks, tags) {
      return tasks.filter(function(task) {
        for (var i in task.Tags) {
          if (tags.indexOf(task[$traceurRuntime.toProperty(i)]) != -1) {
            return true;
          }
        }
        return false;
      });
    };
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvbWlzYy9maWx0ZXIuanMiLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcy9taXNjL2ZpbHRlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmZpbHRlcignc2VsZWN0ZWRUYWdzJywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRhc2tzLCB0YWdzKSB7XG4gICAgICAgIHJldHVybiB0YXNrcy5maWx0ZXIoZnVuY3Rpb24odGFzaykge1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHRhc2suVGFncykge1xuICAgICAgICAgICAgICAgIGlmICh0YWdzLmluZGV4T2YodGFza1tpXSkgIT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIH0pO1xuICAgIH07XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
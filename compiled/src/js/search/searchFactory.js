define([], function() {
  "use strict";
  angular.module('uiRouterSample').factory('searchFactory', function($http) {
    return {search: function(paramsObj) {
        return $http.get('http://10.1.1.118:8000/api/Prospect', {params: paramsObj});
      }};
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvc2VhcmNoL3NlYXJjaEZhY3RvcnkuanMiLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcy9zZWFyY2gvc2VhcmNoRmFjdG9yeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmZhY3RvcnkoJ3NlYXJjaEZhY3RvcnknLFxuIGZ1bmN0aW9uICgkaHR0cCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHNlYXJjaDogZnVuY3Rpb24ocGFyYW1zT2JqKXtcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9Qcm9zcGVjdCcsIHtwYXJhbXM6IHBhcmFtc09iaiB9IClcbiAgICAgICAgfVxuICAgIH07XG4gIH1cbik7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
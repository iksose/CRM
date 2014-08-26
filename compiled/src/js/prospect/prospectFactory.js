define([], function() {
  "use strict";
  angular.module('uiRouterSample').factory('prospectFactory', function($http) {
    return {getProspect_by_ID: function(prospect) {
        return $http.get('http://10.1.1.118:8000/api/prospect/' + prospect.ProspectID);
      }};
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvcHJvc3BlY3QvcHJvc3BlY3RGYWN0b3J5LmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsianMvcHJvc3BlY3QvcHJvc3BlY3RGYWN0b3J5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uZmFjdG9yeSgncHJvc3BlY3RGYWN0b3J5JyxcbiBmdW5jdGlvbiAoJGh0dHApIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRQcm9zcGVjdF9ieV9JRDogZnVuY3Rpb24ocHJvc3BlY3Qpe1xuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL3Byb3NwZWN0LycrcHJvc3BlY3QuUHJvc3BlY3RJRClcbiAgICAgICAgfVxuICAgIH07XG4gIH1cbik7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
define([], function() {
  "use strict";
  angular.module('uiRouterSample').factory('Privilege', function($resource, $http, $q) {
    console.log("Factory loaded");
    return {
      Recipe: $resource('/recipes/:id', {id: '@id'}),
      Users: $resource('/users/:id', {id: '@id'}),
      Group: $resource('/groups/:id', {id: '@id'}),
      Login: $resource('http://10.1.1.118:8000/api/Auth', {userId: '@id'}, {'query': {
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          isArray: false
        }}),
      Example: $resource('api/users/:userId/privileges', {userId: '@id'}, {'query': {
          method: 'GET',
          isArray: false
        }}),
      Cocks: function(alpha, beta) {
        var local = "blargh gargh";
        console.log("POST DUDE", alpha, beta);
        return $http({
          method: 'POST',
          url: 'http://10.1.1.118:8000/api/Auth',
          data: $.param(alpha),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
      }
    };
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvbG9naW4vbG9naW5GYWN0b3J5LmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsianMvbG9naW4vbG9naW5GYWN0b3J5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uZmFjdG9yeSgnUHJpdmlsZWdlJywgZnVuY3Rpb24gKCRyZXNvdXJjZSwgJGh0dHAsICRxKSB7XG4gIGNvbnNvbGUubG9nKFwiRmFjdG9yeSBsb2FkZWRcIilcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBSZWNpcGU6ICAkcmVzb3VyY2UoJy9yZWNpcGVzLzppZCcsIHtpZDogJ0BpZCd9KSxcbiAgICAgICAgICBVc2VyczogICAkcmVzb3VyY2UoJy91c2Vycy86aWQnLCB7aWQ6ICdAaWQnfSksXG4gICAgICAgICAgR3JvdXA6ICAgJHJlc291cmNlKCcvZ3JvdXBzLzppZCcsIHtpZDogJ0BpZCd9KSxcbiAgICAgICAgICBMb2dpbjogICAkcmVzb3VyY2UoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL0F1dGgnLCB7dXNlcklkOiAnQGlkJ30se1xuICAgICAgICAgICAgICAncXVlcnknOntcbiAgICAgICAgICAgICAgICBtZXRob2Q6J1BPU1QnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnMgOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9LFxuICAgICAgICAgICAgICAgIGlzQXJyYXk6ZmFsc2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgRXhhbXBsZTogJHJlc291cmNlKCdhcGkvdXNlcnMvOnVzZXJJZC9wcml2aWxlZ2VzJywge3VzZXJJZDogJ0BpZCd9LHtcbiAgICAgICAgICAgICAgJ3F1ZXJ5Jzp7XG4gICAgICAgICAgICAgICAgbWV0aG9kOidHRVQnLCBpc0FycmF5OmZhbHNlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIENvY2tzOiBmdW5jdGlvbihhbHBoYSwgYmV0YSl7XG4gICAgICAgICAgbGV0IGxvY2FsID0gXCJibGFyZ2ggZ2FyZ2hcIjtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlBPU1QgRFVERVwiLCBhbHBoYSwgYmV0YSlcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvQXV0aCcsXG4gICAgICAgICAgICAgICAgLy8gZGF0YTogJ2FwcGxpY2F0aW9uSWQ9MycsXG4gICAgICAgICAgICAgICAgZGF0YTogJC5wYXJhbShhbHBoYSksXG4gICAgICAgICAgICAgICAgLy8gZGF0YTogJ3Rlc3QyPWR1cnAnLFxuICAgICAgICAgICAgICAgIC8vIGRhdGE6IEpTT04uc3RyaW5naWZ5KGFscGhhKSxcbiAgICAgICAgICAgICAgICAvLyBwYXJhbXM6IGxvY2FsLFxuICAgICAgICAgICAgICAgIGhlYWRlcnMgOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
define([], function() {
  "use strict";
  angular.module('uiRouterSample').factory('rolesFactory', function($http) {
    return {
      listRoles: function() {
        return $http.get('http://10.1.1.118:8000/api/Roles');
      },
      getUsers: function() {
        return $http.get('http://10.1.1.118:8000/api/users');
      },
      addRole: function(user, roleID) {
        return $http.post('http://10.1.1.118:8000/api/users/' + user + '/Roles/' + roleID);
      }
    };
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvcm9sZXMvcm9sZUZhY3RvcnkuanMiLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcy9yb2xlcy9yb2xlRmFjdG9yeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmZhY3RvcnkoJ3JvbGVzRmFjdG9yeScsXG4vLyBub3cgUmVzZWFyY2ggRmFjdG9yeVxuIGZ1bmN0aW9uICgkaHR0cCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGxpc3RSb2xlczpmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvUm9sZXMnIClcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VXNlcnM6ZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS91c2VycycpXG4gICAgICAgIH0sXG4gICAgICAgIGFkZFJvbGU6ZnVuY3Rpb24odXNlciwgcm9sZUlEKXtcbiAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvdXNlcnMvJyt1c2VyKycvUm9sZXMvJytyb2xlSUQpXG4gICAgICAgIH1cbiAgICB9O1xuICB9XG4pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
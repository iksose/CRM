define([], function() {
  "use strict";
  angular.module('uiRouterSample').controller('activityController', function($scope, $rootScope, $http, activityFactory) {
    console.log("Welcome to activity controller");
    $scope.userList = [];
    var getUsers = $http.get('http://10.1.1.118:8000/api/users').then(function(data) {
      console.log("Got users", data.data.UserList);
      $scope.userList = data.data.UserList;
    }).catch(function(err) {});
    $scope.model = activityFactory[0];
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvYWN0aXZpdHkvYWN0aXZpdHlDb250cm9sbGVyLmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsianMvYWN0aXZpdHkvYWN0aXZpdHlDb250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uY29udHJvbGxlcignYWN0aXZpdHlDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkaHR0cCwgYWN0aXZpdHlGYWN0b3J5KSB7XG4gICAgY29uc29sZS5sb2coXCJXZWxjb21lIHRvIGFjdGl2aXR5IGNvbnRyb2xsZXJcIilcblxuICAgICRzY29wZS51c2VyTGlzdCA9IFtdO1xuICAgIHZhciBnZXRVc2VycyA9ICRodHRwLmdldCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvdXNlcnMnKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkdvdCB1c2Vyc1wiLCBkYXRhLmRhdGEuVXNlckxpc3QpXG4gICAgICAgICRzY29wZS51c2VyTGlzdCA9IGRhdGEuZGF0YS5Vc2VyTGlzdFxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgICAvLyBkbyBzb21ldGhpbmdcbiAgICB9KVxuXG5cbiAgICAkc2NvcGUubW9kZWwgPSBhY3Rpdml0eUZhY3RvcnlbMF07XG5cbiAgICAvLyAkc2NvcGUudGVzdCA9IGZ1bmN0aW9uKCl7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKFwiQWN0aXZpdHkgdGVzdFwiKVxuICAgIC8vICAgICBjb25zb2xlLmxvZyhcIk1vZGVsXCIsICRzY29wZS5tb2RlbClcbiAgICAvLyAgICAgY29uc29sZS5sb2coXCJGYWN0b3J5XCIsIGFjdGl2aXR5RmFjdG9yeSlcbiAgICAvLyB9XG5cblxuXG59KVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
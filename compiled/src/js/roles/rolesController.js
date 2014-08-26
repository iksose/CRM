define([], function() {
  "use strict";
  angular.module('uiRouterSample').controller('rolesController', function($scope, $rootScope, $state, rolesFactory) {
    console.log("Roles controller");
    $scope.availableRoles;
    rolesFactory.listRoles().then(function(data) {
      console.log("Got roles...", data.data);
      $scope.availableRoles = data.data;
    });
    $scope.availableUsers;
    rolesFactory.getUsers().then(function(data) {
      console.log("Got users", data.data);
      $scope.availableUsers = data.data.UserList;
    });
    $scope.addRole = function(name, roleID) {
      console.log(name, roleID);
      rolesFactory.addRole(name, roleID).then(function(data) {
        console.log("Done");
      });
    };
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvcm9sZXMvcm9sZXNDb250cm9sbGVyLmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsianMvcm9sZXMvcm9sZXNDb250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uY29udHJvbGxlcigncm9sZXNDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsIHJvbGVzRmFjdG9yeSkge1xuICBjb25zb2xlLmxvZyhcIlJvbGVzIGNvbnRyb2xsZXJcIilcblxuICAkc2NvcGUuYXZhaWxhYmxlUm9sZXM7XG4gIHJvbGVzRmFjdG9yeS5saXN0Um9sZXMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgIGNvbnNvbGUubG9nKFwiR290IHJvbGVzLi4uXCIsIGRhdGEuZGF0YSlcbiAgICAkc2NvcGUuYXZhaWxhYmxlUm9sZXMgPSBkYXRhLmRhdGE7XG4gIH0pO1xuXG4gICRzY29wZS5hdmFpbGFibGVVc2VycztcbiAgcm9sZXNGYWN0b3J5LmdldFVzZXJzKCkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICBjb25zb2xlLmxvZyhcIkdvdCB1c2Vyc1wiLCBkYXRhLmRhdGEpXG4gICAgJHNjb3BlLmF2YWlsYWJsZVVzZXJzID0gZGF0YS5kYXRhLlVzZXJMaXN0XG4gIH0pXG5cblxuICAkc2NvcGUuYWRkUm9sZSA9IGZ1bmN0aW9uKG5hbWUsIHJvbGVJRCl7XG4gICAgY29uc29sZS5sb2cobmFtZSwgcm9sZUlEKVxuICAgIHJvbGVzRmFjdG9yeS5hZGRSb2xlKG5hbWUsIHJvbGVJRCkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgIGNvbnNvbGUubG9nKFwiRG9uZVwiKVxuICAgIH0pXG4gIH1cblxufSlcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
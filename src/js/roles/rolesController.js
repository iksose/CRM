angular.module('uiRouterSample')
.controller('rolesController', function($scope, $rootScope, $state, rolesFactory) {
  console.log("Roles controller")

  $scope.availableRoles;
  rolesFactory.listRoles().then(function(data){
    console.log("Got roles...", data.data)
    $scope.availableRoles = data.data;
  });

  $scope.availableUsers;
  rolesFactory.getUsers().then(function(data){
    console.log("Got users", data.data)
    $scope.availableUsers = data.data.UserList
  })


  $scope.addRole = function(name, roleID){
    console.log(name, roleID)
    rolesFactory.addRole(name, roleID).then(function(data){
      console.log("Done")
    })
  }

})

angular.module('uiRouterSample')
.controller('adminController', function($scope, $rootScope, $state, $alert) {
  console.log("Welcome to the Admin Controller")
  if(!$rootScope.credentials.admin){
    $state.go("home")
    var myAlert = $alert({title: "Forbidden - ",
        content: "We're calling the cops",
        placement: 'top',
        type: 'danger',
        show: true,
        keyboard: true,
        duration: 3
        // container: "body"
      });
  }

})

angular.module('uiRouterSample')
.controller('landingController', function($scope, $rootScope, $state) {
  console.log("Landing Controller")
  if(!$rootScope.loggedIn){
    console.log("Not logged in, redirect")
    $state.go("login");
  }

  $scope.dropdown = [
  {
    "text": "New Campaign",
    "click": '$state.go("home.query")'
  },
  {
    "divider": true
  },
  {
    "text": "Other Campaigns",
    "click": '$state.go("home.campaign")'
  }
];

})

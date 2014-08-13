angular.module('uiRouterSample')
.controller('landingController', function($scope, $rootScope, $state, Tasks) {
  console.log("Landing Controller")
  // Passed in Tasks factory...we'll handle it all here for now

  if(!$rootScope.loggedIn){
    console.log("Not logged in, redirect")
    $state.go("login");
  }

  $scope.dropdown = [
  {
    "text": "New Campaign",
    "click": '$state.go("home.campaign.new")'
  },
  {
    "text": "Saved Campaigns",
    "click": '$state.go("home.campaign")'
  }
  // {
  //   "divider": true
  // },
  // {
  //   "text": "New Query",
  //   "click": '$state.go("home.query")'
  // }

];


$scope.inMarketing = false


if($rootScope.credentials.group == "Marketing"){
  $scope.inMarketing = true;

  // determined their group, rendered view, now to fetch tasks.
  // do we want to do this in the landing controller?
  // or a Tasks controller? With a tasks view?
  var thisUsersGroup = $rootScope.credentials

  $scope.allTasks = []
  var fetch = Tasks.myTasks(thisUsersGroup);
  var showTasks = fetch.then(function(data){
    console.log("Show tasks....", data)
    $scope.allTasks = data.data
  })

}


window.setInterval(function() {
    var entries = window.performance.getEntries();

        entries = entries.sort( function( a, b ) {
            return b.duration - a.duration;
        } );

        $rootScope.metrics = entries;
}, 500);




})
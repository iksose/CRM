angular.module('uiRouterSample')
.controller('queryController', function($scope, $rootScope, $state, queryFactory) {
  console.log("query Controller")
 $scope.resultsReturned = false;

  $scope.results = [];

  $scope.querySearch = function(){
    console.log("New search...please wait...")
    var submit = queryFactory.queryResults();
    var process = submit.then(function(data){
      console.log("Got it...", data)
      $scope.results = data.data;
      $scope.resultsReturned = true;
    })
  }




  $scope.saveTemplate = function(){
    $state.go('home.campaign')
  }


})

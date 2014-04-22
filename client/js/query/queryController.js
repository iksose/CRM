angular.module('uiRouterSample')
.controller('queryController', function($scope, $rootScope, $state, queryFactory) {
  console.log("query Controller")
 $scope.resultsReturned = false;

  $scope.results = {};
  window.results = $scope.results;


  $scope.queryParams = {
    State: "KS, MO, AK",
    Age: "30",
    Product: "TriNet",
    Distance: "50",
    Volume: "high"
  }


  $scope.querySearch = function(){
    console.log("New search...please wait...")
    var submit = queryFactory.queryResults($scope.queryParams);
    var process = submit.then(function(data){
      console.log("Got it...", data)
      $scope.results = data.data;
      window.results = $scope.results;
      $scope.resultsReturned = true;
    })
  }

  $scope.moreProspects = function(){
    console.log("okay we're getting you the next group")
    var submit = queryFactory.moreProspects();
  }

  $scope.DeleteProspect = function(id){
    console.log("Delete this....", id)
    var deleteProspect = queryFactory.deleteProspect(id);
  }




  $scope.saveTemplate = function(){
    $state.go('home.campaign')
  }


})

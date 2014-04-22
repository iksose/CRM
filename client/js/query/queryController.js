angular.module('uiRouterSample')
.controller('queryController', function($scope, $rootScope, $state, queryFactory) {
  console.log("query Controller")
 $scope.resultsReturned = false;

  $scope.results = {};
  window.results = $scope.results;
  $scope.tableConfig = {
    itemsPerPage: 5,
    fillLastPage: false
  }



  $scope.queryParams = {
    State: "KS, MO, AK",
    Age: "30",
    Product: "TriNet",
    Distance: "50",
    Volume: "high"
  }


  $scope.querySearch = function(){
    // clearing old results
    $scope.results = {};
    $scope.resultsReturned = false;
    console.log("New search...please wait...")
    var submit = queryFactory.queryResults($scope.queryParams);
    var process = submit.then(function(data){
      console.log("Got it...", data)
      $scope.results = data.data;
      window.results = $scope.results;
      $scope.resultsReturned = true;
      // var numberOfPages =
    })
  }

  $scope.moreProspects = function(){
    console.log("okay we're getting you the next group")
    var submit = queryFactory.moreProspects();
  }

  $scope.DeleteProspect = function(id){
    console.log("Delete this....", id)
    $scope.results.forEach(function(a,b){
      if(a.name == id){
        a.isActive ? a.isActive = false : a.isActive = true;
        return true;
      }
    })
    // var deleteProspect = queryFactory.deleteProspect(id);
    // no api call...We'll just set the flag and send the object.
  }




  $scope.saveTemplate = function(){
    // send whole list of Prospects returned from search
    // except those flagged not to be a part of the campaign
    var saveQuery = queryFactory.saveQuery($scope.results.prospects);
    console.log("Saving query...")
    //$state.go('home.campaign')
    var gotoCampaign = saveQuery.then(function(res){
      $state.go('home.campaign')
    })
  }


})

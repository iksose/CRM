angular.module('uiRouterSample')
.controller('queryController', function($scope, $rootScope, $state, $stateParams, $location, queryFactory, $q) {
  console.log("query Controller", $stateParams)
  $scope.resultsReturned = false;
  $scope.results = {};
  window.results = $scope.results;
  $scope.tableConfig = {
    itemsPerPage: 10,
    fillLastPage: false
  }




  $scope.selectedIcon = '';
  $scope.selectedIcons = [];
  $scope.icons = [
    {value: 'Kansas', label: 'Kansas'},
    {value: 'AK', label: 'Arkansas'},
    {value: 'Missouri', label: 'Missouri'},
    {value: 'NY', label: 'New York'},
    {value: 'California', label: 'California'},
  ];


  $scope.queryParams = {
    State: "KS, MO, AK",
    Age: "30",
    Product: "TriNet",
    Distance: "50",
    Volume: "high"
  }


  // var changethis = ["KS", "MO"]
  // var changed
  //
  // for(var i = 0; i < changethis.length; i++){
  //   changed += changethis[i] + ", "
  // }


  $scope.querySearch = function(){
    // clearing old results
    $scope.results = {};
    $scope.resultsReturned = false;
    console.log("New search...please wait...")
    $scope.queryParams.State = $scope.selectedIcons;
    var submit = queryFactory.queryResults($scope.queryParams);
    var process = submit.then(data => {
      console.log("Got it...", data)
      $scope.results = data.data;
      window.results = $scope.results;
      $scope.resultsReturned = true;
      $location.search($scope.queryParams)
    })
  }

  $scope.moreProspects = function(){
    console.log("okay we're getting you the next group")
    var submit = queryFactory.moreProspects();
  }

  $scope.DeleteProspect = function(id){
    console.log("Delete this....", id)
    $scope.results.forEach((a,b) => {
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
    var saveQuery = queryFactory.saveQuery($scope.results);
    console.log("Saving query...")
    //$state.go('home.campaign')
    var gotoCampaign = saveQuery.then(function(res){
      $state.go('home.campaign')
    })
  }

  if($stateParams.State != null){
    console.log("Not empty")
    $scope.querySearch();
  }



})

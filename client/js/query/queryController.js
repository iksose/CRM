angular.module('uiRouterSample')
.controller('queryController', function($scope, $rootScope, $state, $stateParams, $location, queryFactory, $q, $alert) {
  console.log("query Controller", $stateParams)
  $scope.resultsReturned = false;
  $scope.results = {};
  $scope.tableConfig = {
    itemsPerPage: 10,
    fillLastPage: false,
    maxPages: 5
  }
  $scope.queryName = "";
  $scope.productList = [
    "TriNet",
    "ProfitGuard"
  ]
  $scope.selectedProduct;
  $scope.queryList;
  $scope.selectedQuery;
  $scope.Clicking_the_table_now_performs_http = false;
  $scope.QueryID;
  $scope.params;
  $scope.selectedStates = [];
  $scope.states = [
    {value: 'Kansas', label: 'Kansas'},
    {value: 'AK', label: 'Arkansas'},
    {value: 'MO', label: 'Missouri'},
    {value: 'TX', label: 'Texas'},
    {value: 'NY', label: 'New York'},
    {value: 'California', label: 'California'},
  ];
  $scope.queryParams = {
    State: [],
    Bill: "Yes"
  }
  // ng-model
  $scope.saveObject = {};

  // populate query list;
  queryFactory.getQueries().then(data => {
    $scope.queryList = data.data
  })


  $scope.findQuery = function(){
    $scope.resultsReturned = false;
    // console.log("Erp", $scope.selectedQuery)
    queryFactory.singleQuery( $scope.selectedQuery.QueryID ).then(data => {
      // console.log("so the user wants to see...", data.data);
      $scope.params = $.deparam(data.data.ParamStr)
      $scope.results = data.data.rows;
      $scope.QueryID = data.data.QueryID;
      $scope.resultsReturned = true;
      $scope.selectedStates = $scope.params.State;
      $scope.Clicking_the_table_now_performs_http = true;
      $scope.saveObject.Name = "LOADED FROM DROPDOWN -- query name is " + data.data.Name ;
    })
  }


  // $scope.selectedState = '';

  $scope.querySearch = function(){
    // clearing old results
    $scope.results = {};
    $scope.resultsReturned = false;
    console.log("New search...please wait...")
    // We need to set each variable when loaded.
    $scope.queryParams.State = $scope.selectedStates
    var submit = queryFactory.queryResults($scope.queryParams);
    var process = submit.then(data => {
      // console.log("Got it...", data.data)
      $scope.results = data.data;
      $scope.resultsReturned = true;
      $location.search($scope.queryParams)
    }).catch(function(err){
      if(err.status == 401)
      // unauthorized
      // $state.go('login');
      console.log("401 is handled by Interceptors")
    })
  }

  $scope.whoa = function(){
    // console.log("Whoa")
    queryFactory.updateQueryName("1").then(data =>{
      console.log("COMPLETE")
    })
  }


  $scope.DeleteProspect = function(id){
      $scope.results.forEach((a,b) => {
        if(a.ProspectID == id){
          a.Status ? a.Status = 0 : a.Status = 1;
          if($scope.Clicking_the_table_now_performs_http){
            queryFactory.updateQueryStatus($scope.QueryID, id, a.Status);
          }
          return true;
        }
      })
  }

  $scope.saveTemplate = function(){
    if($scope.Clicking_the_table_now_performs_http){
      return;
    }
    // send whole list of Prospects returned from search
    // except those flagged not to be a part of the campaign
    $scope.saveObject.rows = $scope.results;
    var params = $location.search();
    var mod = $.param(params);
    $scope.saveObject.ParamStr = mod;
    $scope.saveObject.Product = 1;
    // var saveQuery = queryFactory.saveQuery($scope.saveObject);
    //$state.go('home.campaign')
    // var gotoCampaign = saveQuery.then(function(res){
    //   $state.go('home.campaign')
    // })
    queryFactory.saveQuery($scope.saveObject).then(res =>{
      $state.go('home.campaign')
    }).catch(err =>{
      // console.log(err)
      var myAlert = $alert({title: err.status.toString(),
          content: err.statusText,
          placement: 'top',
          type: 'danger',
          show: true
        });
    })
  }

  // checked on load;
  if($stateParams.State != null){
    // We need to read the URL and set each $scope variable
    $scope.selectedStates = [$stateParams.State]
    $scope.querySearch();
  }




})

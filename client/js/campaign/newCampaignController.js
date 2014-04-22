angular.module('uiRouterSample')
.controller('newCampaignController', function($scope, $rootScope, $state, campaignFactory) {
  console.log("Welcome to NEW campaign controller")
  $scope.savedQueries = [
  {id: "id1"},
  {id: "id2"}
  ];

  $scope.colors = [
    {name:'Northeast Barrens', shade:'dark'},
    {name:'Alaska', shade:'light'},
    {name:'Jamiacan Wonderland', shade:'dark'},
    {name:'Coral Reef', shade:'dark'},
    {name:'Stranglethorn Vale', shade:'light'},
    {name:'Elwynn Forest', shade:'light'}
  ];

  $scope.fetched = false;

  $scope.savedQueryData = "";

  $scope.color = $scope.colors[2]

  $scope.setBillGroup = (data) => {
    $scope.savedQueryData = "";
    console.log("CHANGED")
    // console.log($scope.colors)
    console.log($scope.color)
    var getData = campaignFactory.thisSavedQuery()
    var processData = getData.then(function(data){
      console.log("Got....", data)
      $scope.fetched = true;
      //right now API returns an array...should return an object
      $scope.savedQueryData = data.data[0];
    })
  }

  $scope.changeState = (bleh) => {
    $state.go('home.campaign.details', {params:'1337'})
  }
})

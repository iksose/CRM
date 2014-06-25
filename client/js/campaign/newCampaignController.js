angular.module('uiRouterSample')
.controller('newCampaignController', function($scope, $rootScope, $state, $alert, campaignFactory) {
  console.log("Welcome to NEW campaign controller")

  $scope.campaignID;
  $scope.convert = function(){
    console.log("Converting...");
    campaignFactory.convert(1).then(function(data){
      console.log("DONE, campaign ID ", data.data.CampaignID)
      $scope.campaignID = data.data.CampaignID;
    })
  };

  $scope.savedQueries = [];
  $scope.selectedQuery;
  campaignFactory.getQueries().then(function(data){
    console.log("Got...", data)
    $scope.savedQueries = data.data
  });

  $scope.campaignDetails;
  $scope.setBillGroup = (data) => {
    // $scope.savedQueryData = "";
    console.log("CHANGED", $scope.selectedQuery)
    campaignFactory.singleQuery($scope.selectedQuery.QueryID).then(function(data){
      console.log("Okay got this", data)
      $scope.campaignDetails = data.data;
      $scope.fetched = true;
    })
  };

  $scope.changeState = (bleh) => {
    $state.go('home.campaign.details', {params:'1337'})
  };

  $scope.newActivity = {};
  $scope.savedActivites = [];
  $scope.activityNo = 0;
  $scope.saveActivity = function(){
    console.log("SAVING....", $scope.newActivity);
    var campaignID = 5;
    $scope.newActivity.StartDateTime = "1900-01-01";
    $scope.newActivity.CompletionDateTime = '2014-06-20';
    var save = campaignFactory.saveActivity(campaignID, $scope.newActivity);
    save.catch(function(err){
      var myAlert = $alert({title: err.statusText.toString(),
          content: err.data.Message,
          placement: 'top',
          type: 'danger',
          show: true,
          duration: 3
        });
    });
    save.then(function(result){
      // do something;
    })
    $scope.savedActivites.push($scope.newActivity);
    $scope.activityNo++;
    $scope.newActivity = {};
  };
  
})

angular.module('uiRouterSample')
.controller('newCampaignController', function($scope, $rootScope, $state, $alert, campaignFactory, queryFactory) {
  console.log("Welcome to NEW campaign controller")


  $scope.tableConfig = {
    itemsPerPage: 10,
    fillLastPage: false,
    maxPages: 5
  }

  $scope.DeleteProspect = function(id){
      $scope.campaignDetails.rows.forEach((a,b) => {
        if(a.ProspectID == id){
          a.Status ? a.Status = 0 : a.Status = 1;
            queryFactory.updateQueryStatus($scope.selectedQuery.QueryID, id, a.Status);
          return true;
        }
      })
  }


  $scope.campaignID;
  $scope.campaignConverted = false;
  $scope.convert = function(){
    console.log("Converting...");
    campaignFactory.convert(1).then(function(data){
      console.log("DONE, campaign ID ", data.data.CampaignID)
      $scope.campaignID = data.data.CampaignID;
      $scope.campaignConverted = true;
    })
  };

  $scope.userList = [];
  campaignFactory.getUsers().then(function(data){
    console.log("Got all users....", data)
    $scope.userList = data.data.UserList;
  }).catch(function(err){
    // do something
  })

  $scope.savedQueries = [];
  $scope.selectedQuery;
  campaignFactory.getQueries().then(function(data){
    console.log("Got...", data)
    $scope.savedQueries = data.data
  }).catch(function(err){
    // do something
  })

  $scope.campaignDetails = {};
  $scope.campaignDetails.rows = [];
  $scope.setBillGroup = (data) => {
    // FIXME this is being fired on page init because it thinks the value
    // is changing;
    console.log("CHANGED", $scope.selectedQuery)
    campaignFactory.singleQuery($scope.selectedQuery.QueryID).then(function(data){
      console.log("Okay got these details", data.data)
      $scope.campaignDetails = data.data;
      $scope.fetched = true;
    })
  };
  if($state.params.campaignID !==""){
    // console.log("Yes there's params");
    $scope.selectedQuery = {ProductID: 1, QueryID: $state.params.campaignID, Name: "mo test"}
    $scope.setBillGroup();
  }

  $scope.changeState = (bleh) => {
    $state.go('home.campaign.details', {params:'1337'})
  };

  $scope.newActivity = {};
  $scope.savedActivites = [];
  $scope.activityNo = 0;
  $scope.selectedUser;
  $scope.saveActivity = function(){
    var campaignID = 5;
    $scope.newActivity.StartDateTime = "1900-01-01";
    $scope.newActivity.CompletionDateTime = '2014-06-20';
    $scope.newActivity.AssignedID = $scope.selectedUser.UserID;
    console.log("SAVING....", $scope.newActivity);
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

angular.module('uiRouterSample')
.controller('campaignControllerDetails', function($scope, $rootScope, $state, campaignFactory, $alert) {
  console.log("Welcome to details from campaign controller")

  $scope.params = $rootScope.$stateParams

  $scope.theCampaign = {}

  //campaign is at pending @ Template @ Beginning, not pending
  //Is this always true though? What if it's at Pending to begin
  $scope.campaignPending = false;

  var getCampaign = campaignFactory.singleCampaign($scope.params)
  var displayCampaign = getCampaign.then(function(data){
    console.log("Success...!", data)
    $scope.theCampaign = data.data
  })
  var invalidCampaign = getCampaign.catch(function(err){
    var myAlert = $alert({title: err.statusText,
        content: err.data,
        placement: 'top',
        type: 'danger',
        show: true
      });
  })

  $scope.nextStatus = function(cID){
    console.log("Taking this campaign to the next status...!", cID)
    //if we already called the DB, we can just pass the data along.
    //in fact why don't we just hide the old view
    $scope.campaignPending = true;
  }

  $scope.savetoPending = function(cID){
    console.log("Saving this template to PENDING ", cID)
    $state.go('home')
  }

  $scope.todoText = ""
  $scope.activities = []
  $scope.addActivity = function(){
    console.log("Adding activity ", $scope.todoText)
    $scope.activities.push($scope.todoText)
    $scope.todoText = ""
  }

})

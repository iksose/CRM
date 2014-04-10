angular.module('uiRouterSample')
.controller('campaignControllerDetails', function($scope, $rootScope, $state, campaignFactory, $alert) {
  console.log("Welcome to details from campaign controller")

  $scope.params = $rootScope.$stateParams

  $scope.theCampaign = {}

  var getCampaign = campaignFactory.singleCampaign($scope.params)
  var displayCampaign = getCampaign.then(function(data){
    console.log("Success...!", data)
    $scope.theCampaign = data.data
  })
  var invalidCampaign = getCampaign.catch(function(err){
    // alert("What the fuck")
    var myAlert = $alert({title: err.statusText,
        content: err.data,
        placement: 'top',
        type: 'danger',
        show: true
      });
  })

})

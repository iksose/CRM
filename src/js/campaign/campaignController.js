// Displays whole list of saved campaigns
angular.module('uiRouterSample')
.controller('campaignController', function($scope, $rootScope, $state, campaignFactory) {
  console.log("Welcome from campaign controller")
  $scope.availableCampaigns = []
  var fetchAll = campaignFactory.getCampaigns();
  var displayResults = fetchAll.then(function(data){
    console.log("Got...", data.data)
    $scope.availableCampaigns = data.data
  })

})

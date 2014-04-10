angular.module('uiRouterSample')
.controller('campaignController', function($scope, $rootScope, $state, campaignFactory) {
  console.log("Welcome from campaign controller")
  $scope.availableCampaigns = []
  var fetchAll = campaignFactory.queryResults();
  var displayResults = fetchAll.then(function(data){
    console.log("Got...", data.data)
    $scope.availableCampaigns = data.data
  })

})

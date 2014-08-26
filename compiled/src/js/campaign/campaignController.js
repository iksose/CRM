define([], function() {
  "use strict";
  angular.module('uiRouterSample').controller('campaignController', function($scope, $rootScope, $state, campaignFactory) {
    console.log("Welcome from campaign controller");
    $scope.availableCampaigns = [];
    var fetchAll = campaignFactory.getCampaigns();
    var displayResults = fetchAll.then(function(data) {
      console.log("Got...", data.data);
      $scope.availableCampaigns = data.data;
    });
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvY2FtcGFpZ24vY2FtcGFpZ25Db250cm9sbGVyLmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsianMvY2FtcGFpZ24vY2FtcGFpZ25Db250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uY29udHJvbGxlcignY2FtcGFpZ25Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsIGNhbXBhaWduRmFjdG9yeSkge1xuICBjb25zb2xlLmxvZyhcIldlbGNvbWUgZnJvbSBjYW1wYWlnbiBjb250cm9sbGVyXCIpXG4gICRzY29wZS5hdmFpbGFibGVDYW1wYWlnbnMgPSBbXVxuICB2YXIgZmV0Y2hBbGwgPSBjYW1wYWlnbkZhY3RvcnkuZ2V0Q2FtcGFpZ25zKCk7XG4gIHZhciBkaXNwbGF5UmVzdWx0cyA9IGZldGNoQWxsLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgY29uc29sZS5sb2coXCJHb3QuLi5cIiwgZGF0YS5kYXRhKVxuICAgICRzY29wZS5hdmFpbGFibGVDYW1wYWlnbnMgPSBkYXRhLmRhdGFcbiAgfSlcblxufSlcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
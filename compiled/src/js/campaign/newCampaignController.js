define([], function() {
  "use strict";
  angular.module('uiRouterSample').controller('newCampaignController', function($scope, $rootScope, $state, $alert, campaignFactory, queryFactory) {
    console.log("Welcome to NEW campaign controller");
    $scope.tableConfig = {
      itemsPerPage: 10,
      fillLastPage: false,
      maxPages: 5
    };
    $scope.DeleteProspect = function(id) {
      $scope.campaignDetails.rows.forEach((function(a, b) {
        if (a.ProspectID == id) {
          a.Status ? a.Status = 0 : a.Status = 1;
          queryFactory.updateQueryStatus($scope.selectedQuery.QueryID, id, a.Status);
          return true;
        }
      }));
    };
    $scope.campaignID;
    $scope.campaignConverted = false;
    $scope.convert = function() {
      console.log("Converting...");
      var queryID = $scope.campaignDetails.QueryID;
      console.error(queryID);
      campaignFactory.convert(queryID).then(function(data) {
        console.log("DONE, campaign ID ", data.data.CampaignID);
        $scope.campaignID = data.data.CampaignID;
        $scope.campaignConverted = true;
      });
    };
    $scope.userList = [];
    campaignFactory.getUsers().then(function(data) {
      console.log("Got all users....", data);
      $scope.userList = data.data.UserList;
    }).catch(function(err) {});
    $scope.savedQueries = [];
    $scope.selectedQuery;
    campaignFactory.getQueries().then(function(data) {
      console.log("Got...", data);
      $scope.savedQueries = data.data;
    }).catch(function(err) {});
    $scope.campaignDetails = {};
    $scope.campaignDetails.rows = [];
    $scope.setBillGroup = (function(data) {
      console.log("CHANGED", $scope.selectedQuery);
      campaignFactory.singleQuery($scope.selectedQuery.QueryID).then(function(data) {
        $scope.campaignDetails = new PendingCampaign(data.data);
        console.log($scope.campaignDetails);
        $scope.fetched = true;
      });
    });
    if ($state.params.campaignID !== "") {
      $scope.selectedQuery = {
        ProductID: 1,
        QueryID: $state.params.campaignID,
        Name: "mo test"
      };
      $scope.setBillGroup();
    }
    $scope.changeState = (function(bleh) {
      $state.go('home.campaign.details', {params: '1337'});
    });
    $scope.newActivity = {};
    $scope.savedActivites = [];
    $scope.activityNo = 0;
    $scope.selectedUser;
    $scope.saveActivity = function() {
      $scope.savedActivites.push($scope.newActivity);
      $scope.activityNo++;
      $scope.newActivity = {};
    };
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvY2FtcGFpZ24vbmV3Q2FtcGFpZ25Db250cm9sbGVyLmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsianMvY2FtcGFpZ24vbmV3Q2FtcGFpZ25Db250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uY29udHJvbGxlcignbmV3Q2FtcGFpZ25Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRhbGVydCwgY2FtcGFpZ25GYWN0b3J5LCBxdWVyeUZhY3RvcnkpIHtcbiAgICBjb25zb2xlLmxvZyhcIldlbGNvbWUgdG8gTkVXIGNhbXBhaWduIGNvbnRyb2xsZXJcIilcblxuICAgICRzY29wZS50YWJsZUNvbmZpZyA9IHtcbiAgICAgICAgaXRlbXNQZXJQYWdlOiAxMCxcbiAgICAgICAgZmlsbExhc3RQYWdlOiBmYWxzZSxcbiAgICAgICAgbWF4UGFnZXM6IDVcbiAgICB9XG5cbiAgICAkc2NvcGUuRGVsZXRlUHJvc3BlY3QgPSBmdW5jdGlvbihpZCl7XG4gICAgICAgICRzY29wZS5jYW1wYWlnbkRldGFpbHMucm93cy5mb3JFYWNoKChhLGIpID0+IHtcbiAgICAgICAgICAgIGlmKGEuUHJvc3BlY3RJRCA9PSBpZCl7XG4gICAgICAgICAgICAgICAgYS5TdGF0dXMgPyBhLlN0YXR1cyA9IDAgOiBhLlN0YXR1cyA9IDE7XG4gICAgICAgICAgICAgICAgcXVlcnlGYWN0b3J5LnVwZGF0ZVF1ZXJ5U3RhdHVzKCRzY29wZS5zZWxlY3RlZFF1ZXJ5LlF1ZXJ5SUQsIGlkLCBhLlN0YXR1cyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICAkc2NvcGUuY2FtcGFpZ25JRDtcbiAgICAkc2NvcGUuY2FtcGFpZ25Db252ZXJ0ZWQgPSBmYWxzZTtcbiAgICAkc2NvcGUuY29udmVydCA9IGZ1bmN0aW9uKCl7XG4gICAgY29uc29sZS5sb2coXCJDb252ZXJ0aW5nLi4uXCIpO1xuICAgIHZhciBxdWVyeUlEICA9ICRzY29wZS5jYW1wYWlnbkRldGFpbHMuUXVlcnlJRDtcbiAgICBjb25zb2xlLmVycm9yKHF1ZXJ5SUQpXG4gICAgY2FtcGFpZ25GYWN0b3J5LmNvbnZlcnQocXVlcnlJRCkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJET05FLCBjYW1wYWlnbiBJRCBcIiwgZGF0YS5kYXRhLkNhbXBhaWduSUQpXG4gICAgICAgICRzY29wZS5jYW1wYWlnbklEID0gZGF0YS5kYXRhLkNhbXBhaWduSUQ7XG4gICAgICAgICRzY29wZS5jYW1wYWlnbkNvbnZlcnRlZCA9IHRydWU7XG4gICAgfSlcbiAgICB9O1xuXG4gICAgJHNjb3BlLnVzZXJMaXN0ID0gW107XG4gICAgY2FtcGFpZ25GYWN0b3J5LmdldFVzZXJzKCkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJHb3QgYWxsIHVzZXJzLi4uLlwiLCBkYXRhKVxuICAgICAgICAkc2NvcGUudXNlckxpc3QgPSBkYXRhLmRhdGEuVXNlckxpc3Q7XG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgLy8gZG8gc29tZXRoaW5nXG4gICAgfSlcblxuICAgICRzY29wZS5zYXZlZFF1ZXJpZXMgPSBbXTtcbiAgICAkc2NvcGUuc2VsZWN0ZWRRdWVyeTtcbiAgICBjYW1wYWlnbkZhY3RvcnkuZ2V0UXVlcmllcygpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgY29uc29sZS5sb2coXCJHb3QuLi5cIiwgZGF0YSlcbiAgICAkc2NvcGUuc2F2ZWRRdWVyaWVzID0gZGF0YS5kYXRhXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICAvLyBkbyBzb21ldGhpbmdcbiAgICB9KVxuXG4gICAgJHNjb3BlLmNhbXBhaWduRGV0YWlscyA9IHt9O1xuICAgICRzY29wZS5jYW1wYWlnbkRldGFpbHMucm93cyA9IFtdO1xuICAgICRzY29wZS5zZXRCaWxsR3JvdXAgPSAoZGF0YSkgPT4ge1xuICAgICAgICAvLyBGSVhNRSB0aGlzIGlzIGJlaW5nIGZpcmVkIG9uIHBhZ2UgaW5pdCBiZWNhdXNlIGl0IHRoaW5rcyB0aGUgdmFsdWVcbiAgICAgICAgLy8gaXMgY2hhbmdpbmc7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ0hBTkdFRFwiLCAkc2NvcGUuc2VsZWN0ZWRRdWVyeSlcbiAgICAgICAgY2FtcGFpZ25GYWN0b3J5LnNpbmdsZVF1ZXJ5KCRzY29wZS5zZWxlY3RlZFF1ZXJ5LlF1ZXJ5SUQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzID0gbmV3IFBlbmRpbmdDYW1wYWlnbihkYXRhLmRhdGEpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuY2FtcGFpZ25EZXRhaWxzKVxuICAgICAgICAgICAgJHNjb3BlLmZldGNoZWQgPSB0cnVlO1xuICAgICAgICB9KVxuICAgIH07XG4gICAgaWYoJHN0YXRlLnBhcmFtcy5jYW1wYWlnbklEICE9PVwiXCIpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlllcyB0aGVyZSdzIHBhcmFtc1wiKTtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkUXVlcnkgPSB7UHJvZHVjdElEOiAxLCBRdWVyeUlEOiAkc3RhdGUucGFyYW1zLmNhbXBhaWduSUQsIE5hbWU6IFwibW8gdGVzdFwifVxuICAgICAgICAkc2NvcGUuc2V0QmlsbEdyb3VwKCk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmNoYW5nZVN0YXRlID0gKGJsZWgpID0+IHtcbiAgICAgICAgJHN0YXRlLmdvKCdob21lLmNhbXBhaWduLmRldGFpbHMnLCB7cGFyYW1zOicxMzM3J30pXG4gICAgfTtcblxuICAgICRzY29wZS5uZXdBY3Rpdml0eSA9IHt9O1xuICAgICRzY29wZS5zYXZlZEFjdGl2aXRlcyA9IFtdO1xuICAgICRzY29wZS5hY3Rpdml0eU5vID0gMDtcbiAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyO1xuICAgICRzY29wZS5zYXZlQWN0aXZpdHkgPSBmdW5jdGlvbigpe1xuICAgICAgICAvLyBUT0RPIGRpZG4ndCB3ZSBtYWtlIHRoaXMgaXQncyBvd24gY29udHJvbGxlclxuXG4gICAgICAgIC8vIHZhciBjYW1wYWlnbklEID0gJHNjb3BlLmNhbXBhaWduSUQ7XG4gICAgICAgIC8vICRzY29wZS5uZXdBY3Rpdml0eS5TdGFydERhdGVUaW1lID0gXCIxOTAwLTAxLTAxXCI7XG4gICAgICAgIC8vICRzY29wZS5uZXdBY3Rpdml0eS5Db21wbGV0aW9uRGF0ZVRpbWUgPSAnMjAxNC0wNi0yMCc7XG4gICAgICAgIC8vICRzY29wZS5uZXdBY3Rpdml0eS5Bc3NpZ25lZElEID0gJHNjb3BlLnNlbGVjdGVkVXNlci5Vc2VySUQ7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU0FWSU5HLi4uLlwiLCAkc2NvcGUubmV3QWN0aXZpdHkpO1xuICAgICAgICAvLyB2YXIgc2F2ZSA9IGNhbXBhaWduRmFjdG9yeS5zYXZlQWN0aXZpdHkoY2FtcGFpZ25JRCwgJHNjb3BlLm5ld0FjdGl2aXR5KTtcbiAgICAgICAgLy8gc2F2ZS5jYXRjaChmdW5jdGlvbihlcnIpe1xuICAgICAgICAvLyAgIHZhciBteUFsZXJ0ID0gJGFsZXJ0KHt0aXRsZTogZXJyLnN0YXR1c1RleHQudG9TdHJpbmcoKSxcbiAgICAgICAgLy8gICAgICAgY29udGVudDogZXJyLmRhdGEuTWVzc2FnZSxcbiAgICAgICAgLy8gICAgICAgcGxhY2VtZW50OiAndG9wJyxcbiAgICAgICAgLy8gICAgICAgdHlwZTogJ2RhbmdlcicsXG4gICAgICAgIC8vICAgICAgIHNob3c6IHRydWUsXG4gICAgICAgIC8vICAgICAgIGR1cmF0aW9uOiAzXG4gICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIC8vIHNhdmUudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAvLyAgIC8vIGRvIHNvbWV0aGluZztcbiAgICAgICAgLy8gfSlcbiAgICAgICAgJHNjb3BlLnNhdmVkQWN0aXZpdGVzLnB1c2goJHNjb3BlLm5ld0FjdGl2aXR5KTtcbiAgICAgICAgJHNjb3BlLmFjdGl2aXR5Tm8rKztcbiAgICAgICAgJHNjb3BlLm5ld0FjdGl2aXR5ID0ge307XG4gICAgfTtcblxufSlcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
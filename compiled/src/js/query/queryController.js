define([], function() {
  "use strict";
  angular.module('uiRouterSample').controller('queryController', function($scope, $rootScope, $state, $stateParams, $location, queryFactory, $q, $alert) {
    console.log("query Controller", $stateParams);
    $scope.resultsReturned = false;
    $scope.results = {};
    $scope.tableConfig = {
      itemsPerPage: 10,
      fillLastPage: false,
      maxPages: 5
    };
    $scope.queryName = "";
    $scope.productList = ["TriNet", "ProfitGuard"];
    $scope.selectedProduct;
    $scope.queryList;
    $scope.selectedQuery;
    $scope.Clicking_the_table_now_performs_http = false;
    $scope.QueryID;
    $scope.params;
    $scope.selectedStates = [];
    $scope.states = [{
      value: 'Kansas',
      label: 'Kansas'
    }, {
      value: 'AK',
      label: 'Arkansas'
    }, {
      value: 'MO',
      label: 'Missouri'
    }, {
      value: 'TX',
      label: 'Texas'
    }, {
      value: 'NY',
      label: 'New York'
    }, {
      value: 'CA',
      label: 'California'
    }];
    $scope.queryParams = {State: []};
    $scope.saveObject = {};
    queryFactory.getQueries().then((function(data) {
      $scope.queryList = data.data;
    }));
    $scope.findQuery = function() {
      $scope.resultsReturned = false;
      queryFactory.singleQuery($scope.selectedQuery.QueryID).then((function(data) {
        $scope.params = $.deparam(data.data.ParamStr);
        $scope.results = data.data.rows;
        $scope.QueryID = data.data.QueryID;
        $scope.resultsReturned = true;
        $scope.selectedStates = $scope.params.State;
        $scope.Clicking_the_table_now_performs_http = true;
        $scope.saveObject.Name = "LOADED FROM DROPDOWN -- query name is " + data.data.Name;
      }));
    };
    $scope.querySearch = function() {
      $scope.results = {};
      $scope.resultsReturned = false;
      console.log("New search...please wait...");
      $scope.queryParams.State = $scope.selectedStates;
      $scope.queryParams.ProductID = 1;
      var submit = queryFactory.queryResults($scope.queryParams);
      var process = submit.then((function(data) {
        $scope.results = data.data;
        $scope.resultsReturned = true;
        $location.search($scope.queryParams);
      })).catch(function(err) {
        if (err.status == 401)
          console.log("401 is handled by Interceptors");
      });
    };
    $scope.whoa = function() {
      queryFactory.updateQueryName("1").then((function(data) {
        console.log("COMPLETE");
      }));
    };
    $scope.DeleteProspect = function(id) {
      $scope.results.forEach((function(a, b) {
        if (a.ProspectID == id) {
          a.Status ? a.Status = 0 : a.Status = 1;
          if ($scope.Clicking_the_table_now_performs_http) {
            queryFactory.updateQueryStatus($scope.QueryID, id, a.Status);
          }
          return true;
        }
      }));
    };
    $scope.saveTemplate = function() {
      if ($scope.Clicking_the_table_now_performs_http) {
        console.log("Update");
        $scope.whoa();
        return;
      }
      $scope.saveObject.rows = $scope.results;
      var params = $location.search();
      var mod = $.param(params);
      $scope.saveObject.ParamStr = mod;
      $scope.saveObject.Product = 1;
      queryFactory.saveQuery($scope.saveObject).then((function(res) {
        $state.go('home.campaign.new', {campaignID: res.data.QueryID});
      })).catch((function(err) {
        var myAlert = $alert({
          title: err.status.toString(),
          content: err.statusText,
          placement: 'top',
          type: 'danger',
          show: true
        });
      }));
    };
    $scope.goHref = function(ev) {
      console.log(ev);
      ev.stopPropagation();
      ev.preventDefault();
    };
    if ($stateParams.State != null) {
      $scope.selectedStates = [$stateParams.State];
      $scope.querySearch();
    }
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvcXVlcnkvcXVlcnlDb250cm9sbGVyLmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsianMvcXVlcnkvcXVlcnlDb250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uY29udHJvbGxlcigncXVlcnlDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgJGxvY2F0aW9uLCBxdWVyeUZhY3RvcnksICRxLCAkYWxlcnQpIHtcbiAgY29uc29sZS5sb2coXCJxdWVyeSBDb250cm9sbGVyXCIsICRzdGF0ZVBhcmFtcylcbiAgJHNjb3BlLnJlc3VsdHNSZXR1cm5lZCA9IGZhbHNlO1xuICAkc2NvcGUucmVzdWx0cyA9IHt9O1xuICAkc2NvcGUudGFibGVDb25maWcgPSB7XG4gICAgaXRlbXNQZXJQYWdlOiAxMCxcbiAgICBmaWxsTGFzdFBhZ2U6IGZhbHNlLFxuICAgIG1heFBhZ2VzOiA1XG4gIH1cbiAgJHNjb3BlLnF1ZXJ5TmFtZSA9IFwiXCI7XG4gICRzY29wZS5wcm9kdWN0TGlzdCA9IFtcbiAgICBcIlRyaU5ldFwiLFxuICAgIFwiUHJvZml0R3VhcmRcIlxuICBdXG4gICRzY29wZS5zZWxlY3RlZFByb2R1Y3Q7XG4gICRzY29wZS5xdWVyeUxpc3Q7XG4gICRzY29wZS5zZWxlY3RlZFF1ZXJ5O1xuICAkc2NvcGUuQ2xpY2tpbmdfdGhlX3RhYmxlX25vd19wZXJmb3Jtc19odHRwID0gZmFsc2U7XG4gICRzY29wZS5RdWVyeUlEO1xuICAkc2NvcGUucGFyYW1zO1xuICAkc2NvcGUuc2VsZWN0ZWRTdGF0ZXMgPSBbXTtcbiAgJHNjb3BlLnN0YXRlcyA9IFtcbiAgICB7dmFsdWU6ICdLYW5zYXMnLCBsYWJlbDogJ0thbnNhcyd9LFxuICAgIHt2YWx1ZTogJ0FLJywgbGFiZWw6ICdBcmthbnNhcyd9LFxuICAgIHt2YWx1ZTogJ01PJywgbGFiZWw6ICdNaXNzb3VyaSd9LFxuICAgIHt2YWx1ZTogJ1RYJywgbGFiZWw6ICdUZXhhcyd9LFxuICAgIHt2YWx1ZTogJ05ZJywgbGFiZWw6ICdOZXcgWW9yayd9LFxuICAgIHt2YWx1ZTogJ0NBJywgbGFiZWw6ICdDYWxpZm9ybmlhJ30sXG4gIF07XG4gICRzY29wZS5xdWVyeVBhcmFtcyA9IHtcbiAgICBTdGF0ZTogW11cbiAgfVxuICAvLyBuZy1tb2RlbFxuICAkc2NvcGUuc2F2ZU9iamVjdCA9IHt9O1xuXG4gIC8vIHBvcHVsYXRlIHF1ZXJ5IGxpc3Q7XG4gIHF1ZXJ5RmFjdG9yeS5nZXRRdWVyaWVzKCkudGhlbihkYXRhID0+IHtcbiAgICAkc2NvcGUucXVlcnlMaXN0ID0gZGF0YS5kYXRhXG4gIH0pXG5cblxuICAkc2NvcGUuZmluZFF1ZXJ5ID0gZnVuY3Rpb24oKXtcbiAgICAkc2NvcGUucmVzdWx0c1JldHVybmVkID0gZmFsc2U7XG4gICAgLy8gY29uc29sZS5sb2coXCJFcnBcIiwgJHNjb3BlLnNlbGVjdGVkUXVlcnkpXG4gICAgcXVlcnlGYWN0b3J5LnNpbmdsZVF1ZXJ5KCAkc2NvcGUuc2VsZWN0ZWRRdWVyeS5RdWVyeUlEICkudGhlbihkYXRhID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwic28gdGhlIHVzZXIgd2FudHMgdG8gc2VlLi4uXCIsIGRhdGEuZGF0YSk7XG4gICAgICAkc2NvcGUucGFyYW1zID0gJC5kZXBhcmFtKGRhdGEuZGF0YS5QYXJhbVN0cilcbiAgICAgICRzY29wZS5yZXN1bHRzID0gZGF0YS5kYXRhLnJvd3M7XG4gICAgICAkc2NvcGUuUXVlcnlJRCA9IGRhdGEuZGF0YS5RdWVyeUlEO1xuICAgICAgJHNjb3BlLnJlc3VsdHNSZXR1cm5lZCA9IHRydWU7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRTdGF0ZXMgPSAkc2NvcGUucGFyYW1zLlN0YXRlO1xuICAgICAgJHNjb3BlLkNsaWNraW5nX3RoZV90YWJsZV9ub3dfcGVyZm9ybXNfaHR0cCA9IHRydWU7XG4gICAgICAkc2NvcGUuc2F2ZU9iamVjdC5OYW1lID0gXCJMT0FERUQgRlJPTSBEUk9QRE9XTiAtLSBxdWVyeSBuYW1lIGlzIFwiICsgZGF0YS5kYXRhLk5hbWUgO1xuICAgIH0pXG4gIH1cblxuXG4gIC8vICRzY29wZS5zZWxlY3RlZFN0YXRlID0gJyc7XG5cbiAgJHNjb3BlLnF1ZXJ5U2VhcmNoID0gZnVuY3Rpb24oKXtcbiAgICAvLyBjbGVhcmluZyBvbGQgcmVzdWx0c1xuICAgICRzY29wZS5yZXN1bHRzID0ge307XG4gICAgJHNjb3BlLnJlc3VsdHNSZXR1cm5lZCA9IGZhbHNlO1xuICAgIGNvbnNvbGUubG9nKFwiTmV3IHNlYXJjaC4uLnBsZWFzZSB3YWl0Li4uXCIpXG4gICAgLy8gV2UgbmVlZCB0byBzZXQgZWFjaCB2YXJpYWJsZSB3aGVuIGxvYWRlZC5cbiAgICAkc2NvcGUucXVlcnlQYXJhbXMuU3RhdGUgPSAkc2NvcGUuc2VsZWN0ZWRTdGF0ZXNcblxuICAgIC8vIFRPRE8gZ2V0IFByb2R1Y3QgZnJvbSBzZWxlY3RcbiAgICAkc2NvcGUucXVlcnlQYXJhbXMuUHJvZHVjdElEID0gMVxuXG4gICAgdmFyIHN1Ym1pdCA9IHF1ZXJ5RmFjdG9yeS5xdWVyeVJlc3VsdHMoJHNjb3BlLnF1ZXJ5UGFyYW1zKTtcbiAgICB2YXIgcHJvY2VzcyA9IHN1Ym1pdC50aGVuKGRhdGEgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coXCJHb3QgaXQuLi5cIiwgZGF0YS5kYXRhKVxuICAgICAgJHNjb3BlLnJlc3VsdHMgPSBkYXRhLmRhdGE7XG4gICAgICAkc2NvcGUucmVzdWx0c1JldHVybmVkID0gdHJ1ZTtcbiAgICAgICRsb2NhdGlvbi5zZWFyY2goJHNjb3BlLnF1ZXJ5UGFyYW1zKVxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgICBpZihlcnIuc3RhdHVzID09IDQwMSlcbiAgICAgIC8vIHVuYXV0aG9yaXplZFxuICAgICAgLy8gJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgY29uc29sZS5sb2coXCI0MDEgaXMgaGFuZGxlZCBieSBJbnRlcmNlcHRvcnNcIilcbiAgICB9KVxuICB9XG5cbiAgJHNjb3BlLndob2EgPSBmdW5jdGlvbigpe1xuICAgIC8vIGNvbnNvbGUubG9nKFwiV2hvYVwiKVxuICAgIHF1ZXJ5RmFjdG9yeS51cGRhdGVRdWVyeU5hbWUoXCIxXCIpLnRoZW4oZGF0YSA9PntcbiAgICAgIGNvbnNvbGUubG9nKFwiQ09NUExFVEVcIilcbiAgICB9KVxuICB9XG5cblxuICAkc2NvcGUuRGVsZXRlUHJvc3BlY3QgPSBmdW5jdGlvbihpZCl7XG4gICAgICAkc2NvcGUucmVzdWx0cy5mb3JFYWNoKChhLGIpID0+IHtcbiAgICAgICAgaWYoYS5Qcm9zcGVjdElEID09IGlkKXtcbiAgICAgICAgICBhLlN0YXR1cyA/IGEuU3RhdHVzID0gMCA6IGEuU3RhdHVzID0gMTtcbiAgICAgICAgICBpZigkc2NvcGUuQ2xpY2tpbmdfdGhlX3RhYmxlX25vd19wZXJmb3Jtc19odHRwKXtcbiAgICAgICAgICAgIHF1ZXJ5RmFjdG9yeS51cGRhdGVRdWVyeVN0YXR1cygkc2NvcGUuUXVlcnlJRCwgaWQsIGEuU3RhdHVzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gIH1cblxuICAkc2NvcGUuc2F2ZVRlbXBsYXRlID0gZnVuY3Rpb24oKXtcbiAgICBpZigkc2NvcGUuQ2xpY2tpbmdfdGhlX3RhYmxlX25vd19wZXJmb3Jtc19odHRwKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJVcGRhdGVcIilcbiAgICAgICAgJHNjb3BlLndob2EoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gc2VuZCB3aG9sZSBsaXN0IG9mIFByb3NwZWN0cyByZXR1cm5lZCBmcm9tIHNlYXJjaFxuICAgIC8vIGV4Y2VwdCB0aG9zZSBmbGFnZ2VkIG5vdCB0byBiZSBhIHBhcnQgb2YgdGhlIGNhbXBhaWduXG4gICAgJHNjb3BlLnNhdmVPYmplY3Qucm93cyA9ICRzY29wZS5yZXN1bHRzO1xuICAgIHZhciBwYXJhbXMgPSAkbG9jYXRpb24uc2VhcmNoKCk7XG4gICAgdmFyIG1vZCA9ICQucGFyYW0ocGFyYW1zKTtcbiAgICAkc2NvcGUuc2F2ZU9iamVjdC5QYXJhbVN0ciA9IG1vZDtcbiAgICAkc2NvcGUuc2F2ZU9iamVjdC5Qcm9kdWN0ID0gMTtcbiAgICAvLyB2YXIgc2F2ZVF1ZXJ5ID0gcXVlcnlGYWN0b3J5LnNhdmVRdWVyeSgkc2NvcGUuc2F2ZU9iamVjdCk7XG4gICAgLy8kc3RhdGUuZ28oJ2hvbWUuY2FtcGFpZ24nKVxuICAgIC8vIHZhciBnb3RvQ2FtcGFpZ24gPSBzYXZlUXVlcnkudGhlbihmdW5jdGlvbihyZXMpe1xuICAgIC8vICAgJHN0YXRlLmdvKCdob21lLmNhbXBhaWduJylcbiAgICAvLyB9KVxuICAgIHF1ZXJ5RmFjdG9yeS5zYXZlUXVlcnkoJHNjb3BlLnNhdmVPYmplY3QpLnRoZW4ocmVzID0+e1xuICAgICAgLy8gY29uc29sZS5sb2coXCJTdGF0ZSBnb1wiLCB7Y2FtcGFpZ25JRDogcmVzLmRhdGEuUXVlcnlJRH0pXG4gICAgICAkc3RhdGUuZ28oJ2hvbWUuY2FtcGFpZ24ubmV3Jywge2NhbXBhaWduSUQ6IHJlcy5kYXRhLlF1ZXJ5SUR9IClcbiAgICB9KS5jYXRjaChlcnIgPT57XG4gICAgICAvLyBjb25zb2xlLmxvZyhlcnIpXG4gICAgICB2YXIgbXlBbGVydCA9ICRhbGVydCh7dGl0bGU6IGVyci5zdGF0dXMudG9TdHJpbmcoKSxcbiAgICAgICAgICBjb250ZW50OiBlcnIuc3RhdHVzVGV4dCxcbiAgICAgICAgICBwbGFjZW1lbnQ6ICd0b3AnLFxuICAgICAgICAgIHR5cGU6ICdkYW5nZXInLFxuICAgICAgICAgIHNob3c6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfSlcbiAgfVxuXG4gICRzY29wZS5nb0hyZWYgPSBmdW5jdGlvbihldil7XG4gICAgICBjb25zb2xlLmxvZyhldilcbiAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG4gIC8vIGNoZWNrZWQgb24gbG9hZDtcbiAgaWYoJHN0YXRlUGFyYW1zLlN0YXRlICE9IG51bGwpe1xuICAgIC8vIFdlIG5lZWQgdG8gcmVhZCB0aGUgVVJMIGFuZCBzZXQgZWFjaCAkc2NvcGUgdmFyaWFibGVcbiAgICAkc2NvcGUuc2VsZWN0ZWRTdGF0ZXMgPSBbJHN0YXRlUGFyYW1zLlN0YXRlXVxuICAgICRzY29wZS5xdWVyeVNlYXJjaCgpO1xuICB9XG5cblxuXG5cbn0pXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
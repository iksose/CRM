define([], function() {
  "use strict";
  angular.module('uiRouterSample').factory('campaignFactory', function($http) {
    return {
      queryResults: function(url, callback) {
        return $http.get('/api/campaigns');
      },
      singleCampaign: function(paramID) {
        console.log("Get campaign....#", paramID);
        return $http.get('http://10.1.1.118:8000/api/campaign/' + paramID);
      },
      thisSavedQuery: function(data) {
        return $http.get('api/thisQuery');
      },
      getQueries: function() {
        return $http.get('http://10.1.1.118:8000/api/Research/list');
      },
      singleQuery: function(queryID) {
        return $http.get('http://10.1.1.118:8000/api/Research/' + queryID);
      },
      convert: function(queryID) {
        return $http.post('http://10.1.1.118:8000/api/Campaign', $.param({QueryID: queryID}));
      },
      saveActivity: function(campaignID, activity) {
        return $http.post('http://10.1.1.118:8000/api/Campaign/' + campaignID + '/Activity', $.param(activity));
      },
      getUsers: function() {
        return $http.get('http://10.1.1.118:8000/api/users');
      },
      getCampaigns: function() {
        return $http.get('http://10.1.1.118:8000/api/campaign');
      }
    };
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvY2FtcGFpZ24vY2FtcGFpZ25GYWN0b3J5LmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsianMvY2FtcGFpZ24vY2FtcGFpZ25GYWN0b3J5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uZmFjdG9yeSgnY2FtcGFpZ25GYWN0b3J5JyxcbiBmdW5jdGlvbiAoJGh0dHApIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBxdWVyeVJlc3VsdHM6ZnVuY3Rpb24gKHVybCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvY2FtcGFpZ25zJylcbiAgICAgICAgfSxcbiAgICAgICAgc2luZ2xlQ2FtcGFpZ246ZnVuY3Rpb24gKHBhcmFtSUQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkdldCBjYW1wYWlnbi4uLi4jXCIsIHBhcmFtSUQpXG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvY2FtcGFpZ24vJyArIHBhcmFtSUQpXG4gICAgICAgIH0sXG4gICAgICAgIHRoaXNTYXZlZFF1ZXJ5OiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAvL3dpbGwgaGF2ZSB0byBwYXNzIHdoaWNoIHNhdmVkIHF1ZXJ5IGluIHRoZSBmdXR1cmVcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdhcGkvdGhpc1F1ZXJ5JylcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0UXVlcmllczogZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9SZXNlYXJjaC9saXN0JylcbiAgICAgICAgfSxcbiAgICAgICAgc2luZ2xlUXVlcnk6IGZ1bmN0aW9uKHF1ZXJ5SUQpe1xuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL1Jlc2VhcmNoLycgKyBxdWVyeUlEKTtcbiAgICAgICAgfSxcbiAgICAgICAgY29udmVydDogZnVuY3Rpb24ocXVlcnlJRCl7XG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL0NhbXBhaWduJywgJC5wYXJhbSggeyBRdWVyeUlEIDogcXVlcnlJRCB9ICkgKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2F2ZUFjdGl2aXR5OiBmdW5jdGlvbihjYW1wYWlnbklELCBhY3Rpdml0eSl7XG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL0NhbXBhaWduLycrY2FtcGFpZ25JRCsnL0FjdGl2aXR5JywgJC5wYXJhbShhY3Rpdml0eSkgKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VXNlcnM6ZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS91c2VycycpXG4gICAgICAgIH0sXG4gICAgICAgIGdldENhbXBhaWduczogZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9jYW1wYWlnbicpXG4gICAgICAgIH1cbiAgICB9O1xuICB9XG4pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
define([], function() {
  "use strict";
  angular.module('uiRouterSample').factory('queryFactory', function($http) {
    return {
      queryResults: function(url, callback) {
        console.log("Getting query with params ", url);
        return $http.get('http://10.1.1.118:8000/api/Research', {params: url});
      },
      removeQuery: function(rowID) {
        return $http.put('');
      },
      deleteProspect: function(id) {
        return $http.delete('/api/prospects', {params: {
            'start': '5',
            'end': '20'
          }});
      },
      saveQuery: function(prospects) {
        console.log("Save query Prospects ", prospects);
        return $http.post('http://10.1.1.118:8000/api/Research', $.param(prospects));
      },
      getQueries: function() {
        return $http.get('http://10.1.1.118:8000/api/Research/list');
      },
      singleQuery: function(queryID) {
        return $http.get('http://10.1.1.118:8000/api/Research/' + queryID);
      },
      updateQueryName: function(queryID) {
        return $http.put('http://10.1.1.118:8000/api/Research/' + queryID, $.param({'Name': 'Angular'}));
      },
      updateQueryStatus: function(QueryID, ProspectID, status) {
        return $http.put('http://10.1.1.118:8000/api/Research/' + QueryID + '/' + ProspectID, $.param({'Status': status}));
      }
    };
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvcXVlcnkvcXVlcnlGYWN0b3J5LmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsianMvcXVlcnkvcXVlcnlGYWN0b3J5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uZmFjdG9yeSgncXVlcnlGYWN0b3J5Jyxcbi8vIG5vdyBSZXNlYXJjaCBGYWN0b3J5XG4gZnVuY3Rpb24gKCRodHRwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcXVlcnlSZXN1bHRzOmZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJHZXR0aW5nIHF1ZXJ5IHdpdGggcGFyYW1zIFwiLCB1cmwpXG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvUmVzZWFyY2gnLCB7cGFyYW1zOiB1cmwgfSApXG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZVF1ZXJ5OiBmdW5jdGlvbihyb3dJRCl7XG4gICAgICAgICAgcmV0dXJuICRodHRwLnB1dCgnJylcbiAgICAgICAgfSxcbiAgICAgICAgZGVsZXRlUHJvc3BlY3Q6IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKCcvYXBpL3Byb3NwZWN0cycsIHtwYXJhbXM6IHsnc3RhcnQnOiAnNScsICdlbmQnOiAnMjAnfSB9IClcbiAgICAgICAgfSxcbiAgICAgICAgc2F2ZVF1ZXJ5OiBmdW5jdGlvbihwcm9zcGVjdHMpe1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2F2ZSBxdWVyeSBQcm9zcGVjdHMgXCIsIHByb3NwZWN0cylcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlN0YXRlIGdvIGh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC8jL0NhbXBhaWducy9uZXdcIilcbiAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvUmVzZWFyY2gnLCAkLnBhcmFtKHByb3NwZWN0cykgKVxuICAgICAgICB9LFxuICAgICAgICBnZXRRdWVyaWVzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL1Jlc2VhcmNoL2xpc3QnKVxuICAgICAgICB9LFxuICAgICAgICBzaW5nbGVRdWVyeTogZnVuY3Rpb24ocXVlcnlJRCl7XG4gICAgICAgICAgLy8gcmV0dXJuICRodHRwLmdldCgnL2FwaS9xdWVyeS8nKyBxdWVyeUlEKVxuICAgICAgICAgIC8vIEVTNiBUZW1wbGF0ZSBTdHJpbmdzXG4gICAgICAgICAgLy8gcmV0dXJuICRodHRwLmdldChgL2FwaS9xdWVyeS8ke3F1ZXJ5SUR9YClcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9SZXNlYXJjaC8nICsgcXVlcnlJRCk7XG4gICAgICAgIH0sXG4gICAgICAgIHVwZGF0ZVF1ZXJ5TmFtZTogZnVuY3Rpb24ocXVlcnlJRCl7XG4gICAgICAgICAgcmV0dXJuICRodHRwLnB1dCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvUmVzZWFyY2gvJyArIHF1ZXJ5SUQsICQucGFyYW0oeydOYW1lJzogJ0FuZ3VsYXInfSkgKVxuICAgICAgICB9LFxuICAgICAgICB1cGRhdGVRdWVyeVN0YXR1czogZnVuY3Rpb24oUXVlcnlJRCwgUHJvc3BlY3RJRCwgc3RhdHVzKXtcbiAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9SZXNlYXJjaC8nICsgUXVlcnlJRCArICcvJyArIFByb3NwZWN0SUQsICQucGFyYW0oeydTdGF0dXMnOiBzdGF0dXN9KSApXG4gICAgICAgIH1cbiAgICB9O1xuICB9XG4pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9